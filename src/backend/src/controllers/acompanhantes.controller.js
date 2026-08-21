import AcompanhantesService from "../services/acompanhantes.service.js";

const acompanhantesService = new AcompanhantesService();

export default class AcompanhantesController {
  Listar() {
    return async (req, res) => {
      try {
        const response = await acompanhantesService.Listar();
        return res.status(200).send(response);
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .send({ erro: error.message || "Falha no servidor!" });
      }
    };
  }
  ListarAcompanhantesGestante() {
    return async (req, res) => {
      try {
        const { user } = req.body;
        const response =
          await acompanhantesService.ListarAcompanhantesGestante(user);
        return res.status(200).send(response);
      } catch (error) {
        console.error(error);
        if (error.hasMissingValues) {
          return res.status(400).send({ erro: error.message });
        }
        return res
          .status(500)
          .send({ erro: error.message || "Falha no servidor!" });
      }
    };
  }
  Cadastrar() {
    return async (req, res) => {
      try {
        const { user } = req.body;
        const { dados } = req.body;
        const response = await acompanhantesService.Cadastrar(dados, user);
        return res.status(201).send(response);
      } catch (error) {
        if (error.hasMissingValues) {
          return res.status(400).send({ erro: error.message });
        }
        if (error.userNonExistent || error.hasMaxAcompanhantes) {
          return res.status(404).send({ erro: error.message });
        }
        return res.status(500).send({ erro: "Falha no servidor!" });
      }
    };
  }
  Remover() {
    return async (req, res) => {
      try {
        const id = req.params.id;
        const response = await acompanhantesService.Remover(id);
        return res.status(200).send({ response });
      } catch (error) {
        console.error(error);
        if (error.hasMissingValues) {
          return res.status(400).send({ erro: error.message });
        }
        if (error.userNonExistent || error.hasMaxAcompanhantes) {
          return res.status(404).send({ erro: error.message });
        }
        return res.status(500).send({ erro: "Erro no servidor." });
      }
    };
  }
  Editar() {
    return async (req, res) => {
      try {
        const id_antigo_acompanhante = req.params.id;
        const id_novo_acompanhante = req.body.id;
        const user = req.body.user;
        const response = await acompanhantesService.Editar(
          id_antigo_acompanhante,
          id_novo_acompanhante,
          user,
        );
        return res.status(200).send({ response });
      } catch (error) {
        console.error(error);
        if (error.hasMissingValues) {
          return res.status(400).send({ erro: error.message });
        }
        if (error.userNonExistent) {
          return res.status(404).send({ erro: error.message });
        }
        return res.status(500).send({ erro: "Erro no servidor." });
      }
    };
  }
}
