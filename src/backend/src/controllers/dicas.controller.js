import DicasService from "../services/dicas.service.js";

const dicasService = new DicasService();
export default class DicasController {
  ListarDicas() {
    return async (req, res) => {
      try {
        const dicas = await dicasService.ListarDicas();
        return res.status(200).json({ dicas });
      } catch (error) {
        return res.status(400).json({ erro: error.message });
      }
    };
  }

  ListarDicasPorCategoria() {
    return async (req, res) => {
      try {
        const { categoria } = req.params;
        const dicas = await dicasService.ListarDicasPorCategoria(categoria);
        return res.status(200).json({ dicas });
      } catch (error) {
        return res.status(400).json({ erro: error.message });
      }
    };
  }

  ListarDicasPorGestante() {
    return async (req, res) => {
      try {
        const { id_usuario } = req.params;
        const dicas = await dicasService.ListarDicasPorGestante(id_usuario);
        return res.status(200).json({ dicas });
      } catch (error) {
        return res.status(400).json({ erro: error.message });
      }
    };
  }

  CriarDica() {
    return async (req, res) => {
      try {
        // mesmo padrão do cadastro de usuários: dados dentro de req.body.dados
        const dica = await dicasService.CriarDica(req.body.dados);
        return res.status(201).json({ mensagem: "Dica criada com sucesso.", dica });
      } catch (error) {
        return res.status(400).json({ erro: error.message });
      }
    };
  }

  AlterarDica() {
    return async (req, res) => {
      try {
        const { id_dica } = req.params;
        const dica = await dicasService.AlterarDica(id_dica, req.body.dados);
        return res.status(200).json({ mensagem: "Dica alterada com sucesso.", dica });
      } catch (error) {
        const status = error.message === "Dica não encontrada." ? 404 : 400;
        return res.status(status).json({ erro: error.message });
      }
    };
  }

  VincularLinkDica() {
    return async (req, res) => {
      try {
        const { id_dica } = req.params;
        const { link } = req.body.dados;
        const dica = await dicasService.VincularLinkDica(id_dica, link);
        return res.status(200).json({ mensagem: "Link vinculado com sucesso.", dica });
      } catch (error) {
        const status = error.message === "Dica não encontrada." ? 404 : 400;
        return res.status(status).json({ erro: error.message });
      }
    };
  }

  RemoverDica() {
    return async (req, res) => {
      try {
        const { id_dica } = req.params;
        await dicasService.RemoverDica(id_dica);
        return res.status(200).json({ mensagem: "Dica removida com sucesso." });
      } catch (error) {
        const status = error.message === "Dica não encontrada." ? 404 : 400;
        return res.status(status).json({ erro: error.message });
      }
    };
  }
}