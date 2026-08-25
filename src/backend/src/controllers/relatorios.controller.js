import RelatoriosService from "../services/relatorios.service.js";

const relatoriosService = new RelatoriosService();

export default class RelatoriosController {
  Gerar() {
    return async (req, res) => {
        try {
            const { periodo, user } = req.body;
            const response = await relatoriosService.Gerar(periodo, user);
            return res.status(200).send(response);
        }catch(error) {
            console.error(error);
            if(error.hasMissingValues) {
                return res.status(400).send({erro:"Preencha a data de incio e a data final!"});
            }
            return res.status(500).send({erro:"Falha ao gerar relatório."});
        }
    };
  }
}
