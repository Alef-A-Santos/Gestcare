import GlicemiaService from "../services/glicemia.service.js";
import { lerPaginacao, montarPaginacao } from "../utils/paginacao.js";

const glicemiaService = new GlicemiaService();

export default class GlicemiaController {
  Cadastrar() {
    return async (req, res) => {
      //Req e Res REQ: Contém todos os dados da Requisição. RES:Utilizado para enviar ao usuario a resposta.
      try {
        const { dados } = req.body;
        const { user } = req;
        const response = await glicemiaService.Cadastrar(user, dados);
        return res.status(200).send(response);
      } catch (error) {
        console.error(error);
        if (error.camposFaltando) {
          return res.status(400).send({ erro: error.message }); //Mensagem de Erro ao usuario  // Erro 400: Usado quando o usario faz uma requisição e esquece de algo, ou faz um erro na req.
        }
        return res.status(500).send({ erro: error.message }); //Mensagem de Erro ao usuario   // erro 500: Erro no servidor, quando ocorre algo de errado e retorna o 500.
      }
    };
  }

  Listar() {
    return async (req, res) => {
      try {
        const { user } = req;
        // ?limit=10&offset=0
        const { limit, offset } = lerPaginacao(req.query);
        const { glicemias, total } = await glicemiaService.Listar(
          user,
          limit,
          offset,
        );
        return res.status(200).send({
          glicemias,
          paginacao: montarPaginacao(req, total, limit, offset),
        });
      } catch (error) {
        console.error(error);
        if (error.camposFaltando) {
          return res.status(400).send({ erro: error.message });
        }
        return res.status(500).send({ erro: error.message });
      }
    };
  }

  ListarParaAcompanhante() {
    return async (req, res) => {
      try {
        const { user } = req;
        const { id_gestante } = req.params;
        // ?limit=10&offset=0
        const { limit, offset } = lerPaginacao(req.query);
        const { registros, total } =
          await glicemiaService.ListarParaAcompanhante(
            id_gestante,
            user,
            limit,
            offset,
          );
        return res.status(200).send({
          registros,
          paginacao: montarPaginacao(req, total, limit, offset),
        });
      } catch (error) {
        console.error(error);
        if (error.camposFaltando) {
          return res.status(400).send({ erro: error.message });
        }
        return res
          .status(500)
          .send({ erro: "Falha no servidor ao listar registros." });
      }
    };
  }

  Remover() {
    return async (req, res) => {
      try {
        const { user } = req;
        const { id } = req.params; // o id vem na URL: DELETE /remover-glicemia/:id
        const response = await glicemiaService.Remover(user, id);
        return res.status(200).send(response);
      } catch (error) {
        console.error(error);
        if (error.camposFaltando) {
          return res.status(400).send({ erro: error.message });
        }
        if (error.naoEncontrado) {
          return res.status(404).send({ erro: error.message }); // Erro 404: o registro não existe (ou não pertence a ela)
        }
        return res.status(500).send({ erro: error.message });
      }
    };
  }
}