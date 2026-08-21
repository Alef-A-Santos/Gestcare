import  UsuariosRepository  from "../repository/usuarios.repository.js";
import { criptografar } from "../utils/criptografia.js";
import { testarSenha } from "../utils/verificarSenha.js";
const usuariosRepository = new UsuariosRepository();

export default class UsuariosService {
  async Listar() {
    try {
      const response = await usuariosRepository.Listar();
      return {dados:response, mensagem:"Usuários listados com sucesso!"}; 
    }catch(error) {
      throw new Error(error.message);
    }
  }
  async Cadastrar(dados) {
    try {
      const { nome, email, senha, perfil } = dados;

      if(!nome || !email || !senha || !perfil){
        throw Error('Preencha todos os campos!');
      }

      const resultUsuario = await usuariosRepository.BuscarUsuario(email);
      
      if(resultUsuario.length) {
        throw new Error(JSON.stringify({erro:"Usuário já cadastrado!", status:400}));
      }

      const resultadoTesteSenha = testarSenha(senha);
      if(resultadoTesteSenha){
        throw new Error(JSON.stringify({erro:resultadoTesteSenha, status:400}));
      }

      const senhaCriptografada = await criptografar(senha); 
      const response = await usuariosRepository.Cadastrar(nome, email, senhaCriptografada, perfil);
      return {mensagem:"Usuário cadastrado com sucesso!"}; 
    }catch(error) {
      throw new Error(error.message);
    }
  }
  async Deletar(id) {
    try {
      if(!id) {
        throw new Error(JSON.stringify({erro:"ID está faltando!", status:400}));
      }

      const usuario = await  usuariosRepository.BuscarUsuario(null, id);
      if(!usuario.length) {
        throw new Error(JSON.stringify({erro:"Usuário não encontrado!", status:404}));
      }
      
      const response = await usuariosRepository.Deletar(id);
      return { mensagem: "Usuário deletado com sucesso!" };
    }catch(error) {
      console.error(error)
      throw new Error(error.message);
    }
  }
  async Atualizar(id, dados) {
    try {
      if(!id) {
        throw new Error(JSON.stringify({erro:"ID está faltando!", status:400}));
      }

      if(!dados) {
        throw new Error(JSON.stringify({erro:"Preencha os dados para a atualização!", status:400}));
      }

      const usuario = await usuariosRepository.BuscarUsuario(null, id);
      if(!usuario.length) {
        throw new Error(JSON.stringify({erro:"Usuário não encontrado!", status:404}));
      }

      if(dados.email){
        const emailCadastrado = await usuariosRepository.BuscarUsuario(dados.email);
        
        if(emailCadastrado.length) throw new Error(JSON.stringify({erro:"Email já cadastrado!", status:400}));
      }

      if(dados.senha){
        const resultadoTesteSenha =  testarSenha(dados.senha);
        if(resultadoTesteSenha){
          throw new Error(JSON.stringify({erro: resultadoTesteSenha, status:400}));
        }
      }

      const dadosAtualizados = {
        nome: dados.nome || usuario[0].nome, 
        email: dados.email || usuario[0].email, 
        senha: dados.senha?await criptografar(dados.senha): usuario[0].senha,
        perfil: dados.perfil || usuario[0].perfil,
        ativo: dados?.ativo || usuario[0].ativo
      }

      const response = await usuariosRepository.Atualizar(id, dadosAtualizados);
      return {mensagem:"Dados atualizados com sucesso!"};
    }catch(error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}