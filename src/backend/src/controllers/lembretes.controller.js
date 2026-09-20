import LembretesService from "../services/lembretes.service.js";

const lembretesService = new LembretesService();
const mensagemErroInterno = "Erro interno no servidor!";

export default class LembretesController {
  ListarLembretesUsuario() {
    return async (req, res) => {
      try {
        const { user } = req;
        const response = await lembretesService.ListarLembretesUsuario(user);
        return res.status(200).send(response);
      } catch (error) {
        console.error(error);
        return res.status(500).send({ erro: mensagemErroInterno });
      }
    };
  }
  Criar() {
    return async (req, res) => {
      try {
        const { dados } = req.body;
        const { user } = req;
        const response = await lembretesService.Criar(user, dados);
        return res.status(201).send(response);
      } catch (error) {
        console.error(error);
        if (error.hasMissingValues) {
          return res.status(400).send({ erro: error.message });
        }

        if (error.notFound) {
          return res.status(404).send({ erro: error.message });
        }

        return res.status(500).send({
          erro: error.notCreated ? error.message : mensagemErroInterno,
        });
      }
    };
  }
  AlterarStatus() {
    return async (req, res) => {
      try {
        const { user } = req;
        const { status } = req.body;
        const { id } = req.params;
        const response = await lembretesService.AlterarStatus(id, user, status);
        return res.status(200).send(response);
      } catch (error) {
        console.error(error);
        if (error.notFound) {
          return res.status(404).send({ erro: error.message });
        }

        return res.status(500).send({ erro: mensagemErroInterno });
      }
    };
  }
  Deletar() {
    return async (req, res) => {
      try {
        const { user } = req;
        const { id } = req.params;
        const response = await lembretesService.Deletar(id, user);
        return res.status(200).send(response);
      } catch (error) {
        return res.status(500).send({ erro: mensagemErroInterno });
      }
    };
  }
  Editar() {
    return async (req, res) => {
      try {
        const { user } = req;
        const { dados } = req.body;
        const { id } = req.params;
        const response = await lembretesService.Editar(id, user, dados);
        return res.status(200).send(response);
      } catch (error) {
        console.error(error);
        if (error.notFound) {
          return res.status(404).send({ erro: error.message });
        }

        if (error.hasMissingValues) {
          return res.status(400).send({ erro: error.message });
        }
        return res.status(500).send({ erro: mensagemErroInterno });
      }
    };
  }
}
