import DashboardService from "../services/dashboard.service.js";

const dashboardService = new DashboardService();

export default class DashboardController {
  Resumo() {
    return async (req, res) => {
      try {
        const { user } =  req.body; 
        const resumo = await dashboardService.Resumo(user);
        return res.status(200).send({resumo});
      } catch (error) {
        return res.status(500).send({erro: "Erro ao buscar resumo!"});
      }
    };
  }
}
