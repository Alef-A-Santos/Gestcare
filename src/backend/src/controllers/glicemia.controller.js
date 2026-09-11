import GlicemiaService from "../services/glicemia.service.js";

const glicemiaService = new GlicemiaService();

export default class GlicemiaController {
  Cadastrar() {
    return async (req, res) => {
      //Req e Res REQ: Contém todos os dados da Requisição. RES:Utilizado para enviar ao usuario a resposta.
      try {
        const { user, dados } = req.body;
        const response = await glicemiaService.Cadastrar(user, dados);
        return res.status(200).send(response);
      } catch (error) {
        if (error.camposFaltando) {
          return res.status(400).send({ erro: error.message }); //Mensagem de Erro ao usuario  // Erro 400: Usado quando o usario faz uma requisição e esquece de algo, ou faz um erro na req.
        }
        return res.status(500).send({ erro: error.message }); //Mensagem de Erro ao usuario   // erro 500: Erro no servidor, quando ocorre algo de errado e retorna o 500.
      }
    };
  }
}
