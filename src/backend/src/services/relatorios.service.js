import RelatoriosRepository from "../repository/relatorios.repository.js";

const relatoriosRepository = new RelatoriosRepository();

export default class RelatoriosService {
  async Gerar(periodo, user) {
    try {
      if (!periodo || !periodo.data_inicio || !periodo.data_fim || !user) {
        const error = new Error();
        if (!user) {
          error.userDataMissing = true;

          throw error;
        }

        error.hasMissingValues = true;
        throw error;
      }

      const response = await relatoriosRepository.Gerar(periodo);
      return {
        response,
        mensagem: "Relatório gerado com sucesso!",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
