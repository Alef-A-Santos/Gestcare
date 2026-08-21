import UsuariosService  from "../services/usuarios.service.js";

const usuariosService = new UsuariosService();

export default class UsuariosController {
  Listar(){
    return async (req, res) => {
      try {
        const response = await usuariosService.Listar();
        return res.status(200).send(response);
      }catch(error) {
        console.error(error);
        return res.status(500).send({erro:error.message});
      }
    }
  }
  Cadastrar(){
    return async (req, res) => {
      try {
        const dados = req.body.dados;
      
        const response = await usuariosService.Cadastrar(dados);
        return res.status(201).send(response);
      }catch(error) {
        console.error(error);
        const {erro, status} = JSON.parse(error.message);
        
        if(status) {
          return res.status(status).send({erro});
        }
        return res.status(500).send({erro:erro});
      }
    }
  }
  Deletar() {
    return async (req, res) => {
      try {
        const id = req.params.id;
        const response = await usuariosService.Deletar(id);
        return res.status(200).send({mensagem:'Usuário deletado com sucesso!'})
      }catch(error) {
        console.error(error);
        const {erro, status} = JSON.parse(error.message);
        
        if(status) {
          return res.status(status).send({erro});
        }
        return res.status(500).send({erro:erro});
      }
    }
  }
  Atualizar(){
    return async (req, res) => {
      try {
        const { id } =  req.params;
        const { dados } = req.body;
        const response = await usuariosService.Atualizar(id, dados);
        return res.status(200).send({mensagem:"Dados atualizados com sucesso!"});
      }catch(error){
        console.error(error);
        const {erro, status} = JSON.parse(error.message);
        
        if(status) {
          return res.status(status).send({erro});
        }
        return res.status(500).send({erro:erro});
      }
    }
  }
}