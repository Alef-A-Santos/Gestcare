import AuthRepository from "../repository/auth.repository.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import UsuariosRepository from "../repository/usuarios.repository.js";
import { gerarToken } from "../utils/auth.js";
import { randomBytes } from "crypto";
import { compararDados, criptografar } from "../utils/criptografia.js";
import { testarSenha } from "../utils/verificarSenha.js";
import {
  gerarCodigo,
  tempoRestante,
  validarCodigo,
} from "../utils/codigoValidacao.js";
import { enviarCodigo } from "../utils/sendEmail.js";
import connectDB from "../database/db.js";
import GestcaoRepository from "../repository/gestacao.repository.js";
import GestacaoService from "./gestacao.service.js";

const authRepository = new AuthRepository();
const usuariosRepository = new UsuariosRepository();
const gestacaoRepository = new GestcaoRepository();

const error = new Error();
const camposObrigatoriosCadastroAcompanhante = [
  "email",
  "nome",
  "perfil",
  "senha",
];
const camposObrigatoriosCadastroGestante = [
  ...camposObrigatoriosCadastroAcompanhante,
  "data_ultima_menstruacao",
  "meta_glicemia_jejum",
  "meta_glicemia_pos",
];

export default class AuthService {
  #campos = {
    email: "Email",
    nome: "Nome",
    perfil: "Perfil",
    senha: "Senha",
    data_ultima_menstruacao: "Data da última menstruação",
    meta_glicemia_jejum: "Meta glicemia jejum",
    meta_glicemia_pos: "Meta glicemia pos",
  };

  async Logar(dados) {
    try {
      const { email, senha } = dados;

      if (!email || !senha) {
        error.hasMissingValues = true;
        error.message = "Email e senha são obrigatórios!";
        throw error;
      }

      const usuario = await usuariosRepository.BuscarUsuario(email);
      if (!usuario.length) {
        error.notFound = true;
        error.message = "Usuário não encontrado";
        throw error;
      }

      if (!usuario[0].ativo) {
        error.message = "Usuário inativo!";
        error.inactiveUser = true;
        throw error;
      }

      // const senhaEncriptada = await criptografar(senha);
      const isSenhaCorreta = await compararDados(senha, usuario[0].senha);
      if (!isSenhaCorreta) {
        error.incorrectPasswd = true;
        error.message = "Email ou senha incorreto(s)!";
        throw error;
      }

      const token = await gerarToken(usuario[0]);
      if (token?.erro) {
        error.message = token.erro;
        throw error;
      }
      const auth = randomBytes(50).toString("hex");

      const response = await authRepository.Logar(auth, email);

      const dadosUsuario = {
        id: usuario[0].id_usuario,
        nome: usuario[0].nome,
        email: usuario[0].email,
        perfil: usuario[0].perfil,
      };

      return {
        mensagem: "Usuário autenticado com sucesso!",
        token,
        dadosUsuario,
      };
    } catch (error) {
      throw error;
    }
  }
  async Cadastrar(dados) {
    let db;
    try {
      let camposFaltando;
      const isGestante = dados.perfil === "gestante";
      if (isGestante) {
        camposFaltando = camposObrigatoriosCadastroGestante
          .filter((campo) => !dados[campo])
          .map((campoFiltrados) => this.#campos[campoFiltrados]);
      } else if (dados.perfil === "acompanhante") {
        camposFaltando = camposObrigatoriosCadastroAcompanhante
          .filter((campo) => !dados[campo])
          .map((campoFiltrados) => this.#campos[campoFiltrados]);
      } else {
        error.nonExistent = true;
        error.message = "O campo de perfil é obrigatório!";
        throw error;
      }

      if (!dados || camposFaltando.length) {
        error.hasMissingValues = true;
        error.message = `Preencha o(s) campo(s): ${camposFaltando.join(",")}`;
        throw error;
      }

      const isInvalida = testarSenha(dados.senha);
      if (isInvalida) {
        error.invalidPasswd = true;
        error.message = isInvalida;
        throw error;
      }

      db = await connectDB();
      db.beginTransaction();
      const [user] = await db.query(
        "SELECT nome, email FROM usuarios WHERE email = ?",
        [dados.email],
      );

      if (user.length) throw error;

      const usuario = {
        nome: dados.nome,
        email: dados.email,
        senha: await criptografar(dados.senha),
        perfil: dados.perfil,
      };

      const response = await authRepository.Cadastrar(
        codigoValidacao,
        usuario,
        db,
      );
      usuario.id_usuario = response.id_usuario;

      if (isGestante) {
        dados.data_prev_parto = await GestacaoService.getDataPrevParto(
          dados.data_ultima_menstruacao,
          db,
        );
        const responseGestacao = await gestacaoRepository.CriarGestacao(
          dados,
          usuario,
          db,
        );
      }

      const codigoValidacao = gerarCodigo();
      const emailEnviado = await enviarCodigo(codigoValidacao, dados.email);
      if (!emailEnviado) {
        error.emailNotSended = true;
        error.message = "Falha ao enviar o código de validação!";
        throw error;
      }

      setTimeout(async () => {
        await db.query(
          "UPDATE usuarios SET codigo_validacao = null WHERE email = ?",
          [dados.email],
        );
      }, 30000);

      db.commit();
      return {
        mensagem: "Código de validação enviado para o email!",
        dadosUsuario: {
          nome: usuario.nome,
          email: usuario.email,
        },
      };
    } catch (error) {
      if (db) db.rollback();
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async ValidarCodigo(codigo, dados) {
    let db;
    try {
      if (!codigo || !dados.email) {
        error.hasMissingValues = true;
        error.message = "Email do usuário e código validação são obrigatórios!";
        throw error;
      }

      db = await connectDB();
      const [result] = await db.query(
        "SELECT codigo_validacao FROM usuarios WHERE email = ?",
        [dados.email],
      );
      const { codigo_validacao } = result[0];

      if (!result.length) {
        error.notFound = true;
        error.message = "Email não cadastrado!";

        throw error;
      }

      if (!codigo_validacao) {
        error.expiredCode = true;
        error.message = "Código expirou!";
        throw error;
      }

      const isValido =
        validarCodigo(codigo) !== null || codigo === codigo_validacao;
      if (!isValido) {
        error.invalidCode = true;
        error.message = "Código incorreto!";
        throw error;
      }

      const token = await gerarToken(result[0]);
      if (token?.erro) throw new Error(JSON.stringify(token.erro));
      const auth = randomBytes(50).toString("hex");

      const response = await authRepository.Validar(auth, dados);
      const usuario = {
        id: response.id_usuario,
        nome: response.nome,
        email: response.email,
        perfil: response.perfil,
      };
      return {
        mensagem: "Email válidado com sucesso!",
        usuario,
        token,
      };
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async ReenviarCodigo(dados) {
    try {
      if (!dados || !dados.email) {
        error.hasMissingValues = true;
        error.message = "Email do usuário é obrigatório!";
        throw error;
      }

      const codigoValidacao = gerarCodigo();
      const emailEnviado = await enviarCodigo(codigoValidacao, dados.email);
      if (!emailEnviado) {
        error.emailNotSended = true;
        error.message = "Falha ao enviar o código de validação!";

        throw error;
      }
      const response = await authRepository.ReenviarCodigo(
        codigoValidacao,
        dados,
      );

      return {
        mensagem: "Código enviado com sucesso!",
      };
    } catch (error) {
      throw error;
    }
  }
}
