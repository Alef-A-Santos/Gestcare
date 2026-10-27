import { gerarTemplateRelatorio } from "../HTMLTemplates/relatorioTemplate.js";
import RelatoriosService from "../services/relatorios.service.js";
import { GerarPdfTemplate } from "../utils/pdf.js";

const relatoriosService = new RelatoriosService();

export default class RelatoriosController {
  Gerar() {
    return async (req, res) => {
      try {
        const { dados } = req.body;
        const { user } = req;
        const response = await relatoriosService.Gerar(dados, user);
        const caminho_relatorio = await GerarPdfTemplate(gerarTemplateRelatorio(response.response), `relatorio_${user.id_usuario}_${dados.data_inicio}_${dados.data_fim}`);
        return res.status(200).sendFile(caminho_relatorio);
      } catch (error) {
        console.error(error);
        return this.#VerificarErro(res, error);
      }
    };
  }
  CalcularMediaPeriodo() {
    return async (req, res) => {
      try {
        const { dados } = req.body;
        const { user } = req;
        const response = await relatoriosService.CalcularMediaPeriodo(
          dados,
          user,
        );
        return res.status(200).send(response);
      } catch (error) {
        console.error(error);
        return this.#VerificarErro(res, error);
      }
    };
  }
  CalcularMediasSemanais() {
    return async (req, res) => {
      try {
        const { dados } = req.body;
        const { user } = req;
        const response = await relatoriosService.CalcularMediasSemanais(
          dados,
          user,
        );
        return res.status(200).send(response);
      } catch (error) {
        console.error(error);
        return this.#VerificarErro(res, error);
      }
    };
  }
  CalcularMediasMensais() {
    return async (req, res) => {
      try {
        const { dados } = req.body;
        const { user } = req;
        const response = await relatoriosService.CalcularMediasMensais(
          dados,
          user,
        );
        return res.status(200).send(response);
      } catch (error) {
        console.error(error);
        return this.#VerificarErro(res, error);
      }
    };
  }

  // A hashtag(#) torna o método privado
  #VerificarErro(res, error) {
    if (error.camposFaltando) {
      return res
        .status(400)
        .send({
          erro:
            error.message || "Data de inicio, fim e o ano  são   obrigatórios!",
        });
    }
    return res.status(500).send({ erro: "Falha ao gerar relatório." });
  }
}
