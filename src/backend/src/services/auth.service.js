import AuthRepository from "../repository/auth.repository.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import UsuariosRepository from "../repository/usuarios.repository.js";
import { gerarToken } from "../utils/auth.js";
import { randomBytes } from "crypto";
import { compararDados, criptografar } from "../utils/criptografia.js";
import { testarSenha } from "../utils/verificarSenha.js";
import { gerarCodigo, tempoRestante, validarCodigo } from "../utils/codigoValidacao.js";
import { enviarCodigo } from "../utils/sendEmail.js";
import connectDB from "../database/db.js";

const authRepository = new AuthRepository();
const usuariosRepository = new UsuariosRepository();
export default class AuthService {
  async Logar(dados) {
    try {
      const { email, senha } = dados;

      if (!email || !senha) {
        throw new Error("Email e senha são obrigatórios!");
      }

      const usuario = await usuariosRepository.BuscarUsuario(email);
      if (!usuario.length) {
        throw new Error(
          JSON.stringify({ erro: "Usuário não encontrado", status: 404 }),
        );
      }

      if (!usuario[0].ativo) {
        throw new Error(
          JSON.stringify({ erro: "Usuário inativo!", status: 400 }),
        );
      }

      // const senhaEncriptada = await criptografar(senha);
      const isSenhaCorreta = await compararDados(senha, usuario[0].senha);
      if (!isSenhaCorreta) {
        throw new Error(
          JSON.stringify({ erro: "Email ou senha incorreto(s)!", status: 400 }),
        );
      }

      const token = await gerarToken(usuario[0]);
      if (token?.erro) throw new Error(JSON.stringify(token.erro));
      const auth = await randomBytes(50).toString("hex");

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
      console.error(error);
      throw new Error(error.message);
    }
  }
  async Cadastrar(dados) {
    let db;
    try {
      if (!dados.email 
          || !dados.nome 
          || !dados.perfil 
          || !dados.senha
      ) {
        throw new Error(
          JSON.stringify({ mensagem: "Preencha todos os campos!", status:400  })
        );
      }

      const isInvalida = await testarSenha(dados.senha);
      if (isInvalida) {
        throw new Error(JSON.stringify({ erro: isInvalida, status:400 }));
      }

      db = await connectDB();
      const [user] = await db.query("SELECT nome, email FROM usuarios WHERE email = ?", [dados.email]);

      if(user.length) {
        throw new Error(JSON.stringify({ erro: "Email já cadastrado!", status:400  }));
      }

      const codigoValidacao = gerarCodigo();
      const emailEnviado = await enviarCodigo(codigoValidacao,dados.email);
      if(!emailEnviado){
        throw new Error(JSON.stringify({ erro: "Falha ao enviar o código de válidação!"}));
      }

      setTimeout(async ()=>{
        await db.query("UPDATE usuarios SET codigo_validacao = null WHERE email = ?", [dados.email]);
      }, 30000);

      const usuario = {
        nome:dados.nome,
        email:dados.email,
        senha:await criptografar(dados.senha),
        perfil:dados.perfil,
      };

      const reponse = await authRepository.Cadastrar(codigoValidacao, usuario);
      return {
        mensagem:"Código de validação enviado para o email!",
        dadosUsuario:{
          nome:usuario.nome,
          email:usuario.email,
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }finally{ 
      if(db) db.release();
    }
  }
  async ValidarCodigo(codigo, dados) {
    let db;
    try {
      if(!codigo || !dados.email){
          throw new Error(JSON.stringify({ erro: "Email do usuário é obrigatório!", status:400  }));
      }
      db = await connectDB();
      const [result] = await db.query("SELECT codigo_validacao FROM usuarios WHERE email = ?",[dados.email]);
      const { codigo_validacao } = result[0]
      if(!result.length) {
          throw new Error(JSON.stringify({ erro: "Email não cadastrado!", status:404}));
      }

      if(!codigo_validacao) {
        throw new Error(JSON.stringify({ erro: "Código expirou!", status:400}));
      }
      
      const isValido = ((validarCodigo(codigo) !== null) || (codigo === codigo_validacao));
      if(!isValido){
          throw new Error(JSON.stringify({ erro: "Código incorreto!", status:400}));
      }

      const token = await gerarToken(result[0]);
      if (token?.erro) throw new Error(JSON.stringify(token.erro));
      const auth = randomBytes(50).toString("hex");

      const response = await authRepository.Validar(auth,dados);
      const usuario = {
        id: response.id_usuario,
        nome: response.nome,
        email: response.email,
        perfil: response.perfil,
      }
      return {
        mensagem:"Email válidado com sucesso!",
        usuario,
        token,
      }
    }catch(error) {
      console.error(error);
      throw new Error(error.message);
    }finally{
      if(db)db.release();
    }
  }
  async ReenviarCodigo(dados){
    try{
      if(!dados || !dados.email){
        throw new Error(JSON.stringify({erro:"Email do usuário é obrigatório!", status:400}))
      }

      const codigoValidacao = gerarCodigo();
      const emailEnviado = await enviarCodigo(codigoValidacao,dados.email);
      if(!emailEnviado){
        throw new Error(JSON.stringify({ erro: "Falha ao enviar o código de válidação!", staus:500}));
      }
      const response = await authRepository.ReenviarCodigo(codigoValidacao, dados);

      return{
        mensagem:"Código enviado com sucesso!"
      }
    }catch(error){
      console.error(error);
      throw error;
    }
  }
}
