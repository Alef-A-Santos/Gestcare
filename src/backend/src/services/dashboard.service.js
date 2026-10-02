import GestacaoRepository from "../repository/gestacao.repository.js";
import GlicemiaRespository from "../repository/glicemia.repository.js";
import LembretesRepository from "../repository/lembretes.repository.js";

const glicemiaRespository = new GlicemiaRespository();
const lembretesRepository = new LembretesRepository();
const diasSemana = {
  "domingo":0,
  "segunda-feira":1,
  "terça-feira":2,
  "quarta-feira":3,
  "quinta-feira":4,
  "sexta-feira":5,
  "sábado":6,
};

export default class DashboardService {
  async Resumo(user){
    try {
      const data = new Date();
      const dataBr = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(data); // Formata o dia da semana no formato BR escrito por extenso( EX: Segunda-feira )
      const diaAtual = diasSemana[dataBr];

      const ultima_medicao = await glicemiaRespository.BuscarUltimaMedicao(user);
      const { media } = await glicemiaRespository.GerarMediaUtimasSeteMedicoes(user);
      const proximos_lembretes = await lembretesRepository.buscarLembretesDia(user, diaAtual);
      const { qtd_semanas } = await GestacaoRepository.getQuantidadeSemanas(user);
      const resumo = {
        ultima_medicao,
        media,
        proximos_lembretes,
        qtd_semanas
      };

      return resumo;
    } catch (error) {
      throw error;
    }
  }
}