import DiarioService from "../services/diario.service.js";

const diarioService = new DiarioService();

const statusDoErro = (error) =>
  error.message === "Refeição não encontrada." ? 404 : 400;

export default class DiarioController {
  CadastrarRefeicao() {
    return async (req, res) => {
      try {
        // mesmo padrão dos outros módulos: dados dentro de req.body.dados
        const refeicao = await diarioService.CadastrarRefeicao(req.body.dados);
        return res
          .status(201)
          .json({ mensagem: "Refeição registrada com sucesso.", refeicao });
      } catch (error) {
        return res.status(400).json({ erro: error.message });
      }
    };
  }

  ListarRefeicoes() {
    return async (req, res) => {
      try {
        const { id_usuario } = req.params;
        const { data } = req.query; // opcional: ?data=2026-11-05
        const refeicoes = await diarioService.ListarRefeicoes(id_usuario, data);
        return res.status(200).json({ refeicoes });
      } catch (error) {
        return res.status(400).json({ erro: error.message });
      }
    };
  }

  AlterarRefeicao() {
    return async (req, res) => {
      try {
        const { id_refeicao } = req.params;
        const refeicao = await diarioService.AlterarRefeicao(
          id_refeicao,
          req.body.dados
        );
        return res
          .status(200)
          .json({ mensagem: "Refeição alterada com sucesso.", refeicao });
      } catch (error) {
        return res.status(statusDoErro(error)).json({ erro: error.message });
      }
    };
  }

  RemoverRefeicao() {
    return async (req, res) => {
      try {
        const { id_refeicao } = req.params;
        await diarioService.RemoverRefeicao(id_refeicao);
        return res
          .status(200)
          .json({ mensagem: "Refeição removida com sucesso." });
      } catch (error) {
        return res.status(statusDoErro(error)).json({ erro: error.message });
      }
    };
  }
}