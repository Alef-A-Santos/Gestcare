import DiarioRepository from "../repository/diario.repository.js";
import GestacaoRepository from "../repository/gestacao.repository.js";
import GlicemiaRespository from "../repository/glicemia.repository.js";
import LembretesRepository from "../repository/lembretes.repository.js";
import static_json from "../assets/json/frases.json" with { type: "json" };
import UsuariosRepository from "../repository/usuarios.repository.js";

const glicemiaRespository = new GlicemiaRespository();
const lembretesRepository = new LembretesRepository();
const diarioAlimentarRepository = new DiarioRepository();
const error = new Error();

const diasSemana = {
  domingo: 0,
  "segunda-feira": 1,
  "terça-feira": 2,
  "quarta-feira": 3,
  "quinta-feira": 4,
  "sexta-feira": 5,
  sábado: 6,
};

export default class DashboardService {
  async Resumo(user) {
    try {
      const data = new Date();
      const dataBr = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
      }).format(data); // Formata o dia da semana no formato BR escrito por extenso( EX: Segunda-feira )
      const diaAtual = diasSemana[dataBr];

      const ultima_medicao =
        await glicemiaRespository.BuscarUltimaMedicao(user);
      const { media } =
        await glicemiaRespository.GerarMediaUtimasSeteMedicoes(user);
      const proximos_lembretes = await lembretesRepository.buscarLembretesDia(
        user,
        diaAtual,
      );
      const { qtd_semanas, semana } =
        await GestacaoRepository.getQuantidadeSemanas(user);
      const frase_semana = static_json.FRASES[semana];
      const refeicoes =
        await diarioAlimentarRepository.buscarRefeicoesDia(user.id_usuario);
      const data_prev = await GestacaoRepository.getDataPrevParto(user);
      const trimestre = this.#obterTrimestre(
        new Date(data_prev.data_prev_parto),
        data,
      );

      const resumo = {
        ultima_medicao,
        media,
        proximos_lembretes,
        qtd_semanas,
        refeicoes,
        semana,
        trimestre,
        frase_semana,
        data_prev_parto: data_prev.data_prev_mascarada,
      };

      return resumo;
    } catch (error) {
      throw error;
    }
  }
  async ResumoAcompanhante(id_gestante) {
    try {
      if(!id_gestante) {
        error.camposFaltando = true;
        error.message = "Gestante não identificada para busca do resumo!";
      }
      const user = {
        id_usuario: id_gestante
      }
      const resumo = await this.Resumo(user); 
  
      return resumo;
    } catch (error) {
      throw error;
    }
  }

  #obterTrimestre(data_prev, data_atual) {
    const diferenca_mes = Math.abs(
      data_atual.getMonth() - data_prev.getMonth(),
    );
    if (diferenca_mes >= 0 && diferenca_mes <= 3) {
      return "3º Trimestre";
    } else if (diferenca_mes >= 4 && diferenca_mes <= 6) {
      return "2º Trimestre";
    } else if (diferenca_mes >= 5 && diferenca_mes <= 9) {
      return "1º Trimestre";
    } else {
      return "Não foi possível identificar o trimestre atual! Tente novamente mais tarde.";
    }
  }
}
