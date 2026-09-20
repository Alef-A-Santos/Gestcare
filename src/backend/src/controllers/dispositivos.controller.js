import DispositivosService from '../services/dispositivos.service.js';

const dispositivosService = new DispositivosService();

const mensagemErroInterno = 'Erro interno no servidor.';

export default class DispositivosController {
  ListarDispositivosUsuario() {
    return async (req, res) => {
      try {
        const { user } = req;
        const response  = dispositivosService.ListarDispositivosUsuario(user);
        return res.status(200).send(response); 
      }catch(error) {
        console.error(error);
        return res.status(500).send({erro:mensagemErroInterno});
      }
    }
  }
  Cadastrar() {
    return async (req, res) => {
      try {
        const { user } = req;
        const { subscription } = req.body;
        const nome = req.get("User-Agent"); // Pega o nome do dispositivo/client que fez a requisição
        const response = await dispositivosService.Cadastrar(user, subscription, nome);
        return res.status(201).send(response); 
      }catch(error) {
        console.error(error);
        if(error.hasMissingValues || error.code === "ER_DUP_ENTRY") {
          if(error.code === "ER_DUP_ENTRY") error.message = "Dispositivo já cadastrado!";
          return res.status(400).send({erro:error.message});
        }

        return res.status(500).send({erro:mensagemErroInterno});
      }
    }
  }
  AlterarStatus() {
    return async (req, res) => {
      try {
        const { id } = req.params;
        const { user } = req;
        const { status } = req.body; 
        const response = await dispositivosService.AlterarStatus(user, status, id);
        return res.status(200).send(response);
      }catch(error) {
        console.error(error);

        if(error.hasMissingValues) {
          return res.status(400).send({erro: error.message});
        }

        if(error.notFound) {
          return res.status(404).send({erro: error.message});
        }
        return res.status(500).send({erro:mensagemErroInterno});
      }
    }
  }
  Deletar() {
    return async (req, res) => {
      try{
        const { user } = req;
        const { id } = req.params;
        const response = await dispositivosService.Deletar(user, id);
        return res.status(200).send(response);
      }catch(error){
        console.error(error);

        if(error.hasMissingValues) {
          return res.status(400).send({erro:error.message});
        }

        return res.status(500).send({erro: error.notSucced ? error.message : mensagemErroInterno});
      }
    }
  }
  Editar() {
    return async (req, res) =>{
      try {
        const { dados } =  req.body;
        const { user } = req;
        const { id } = req.params;
        const response = await dispositivosService.Editar(user, id, dados);
        return res.status(200).send(response);
      }catch(error) {
        console.error(error);
        if(error.hasMissingValues){
          return res.status(400).send({erro:error.message});
        }

        return res.status(500).send({erro:mensagemErroInterno});
      }
    }
  }
}