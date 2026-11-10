import DiarioRepository from "../repository/diario.repository.js";

const TIPOS_REFEICAO_VALIDOS = [
  "Café da Manhã",
  "Lanche da Manhã",
  "Almoço",
  "Lanche da Tarde",
  "Jantar",
  "Ceia",
];

const diarioRepository = new DiarioRepository();

// aceita "2026-11-05 12:30", "2026-11-05 12:30:00" ou "2026-11-05T12:30[:00]"
// e devolve no formato do DATETIME do MySQL: "AAAA-MM-DD HH:MM:SS"
function normalizarDataHora(valor) {
  const match = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(:\d{2})?$/.exec(valor);
  if (!match) {
    throw new Error("Data e hora inválidas. Use o formato AAAA-MM-DD HH:MM.");
  }
  const [, data, hora, segundos] = match;
  const dataHora = `${data} ${hora}${segundos ?? ":00"}`;
  if (isNaN(new Date(dataHora.replace(" ", "T")))) {
    throw new Error("Data e hora inválidas. Use o formato AAAA-MM-DD HH:MM.");
  }
  return dataHora;
}

function validarEMontar({
  tipo_refeicao,
  descricao_alimentos,
  data_hora,
} = {}) {
  if (!tipo_refeicao || !descricao_alimentos || !data_hora) {
    throw new Error(
      "Tipo da refeição, descrição dos alimentos e data/hora são obrigatórios.",
    );
  }
  if (!TIPOS_REFEICAO_VALIDOS.includes(tipo_refeicao)) {
    throw new Error(
      `Tipo de refeição inválido. Use um de: ${TIPOS_REFEICAO_VALIDOS.join(", ")}`,
    );
  }
  if (descricao_alimentos.length > 255) {
    throw new Error(
      "A descrição dos alimentos deve ter no máximo 255 caracteres.",
    );
  }
  return {
    tipo_refeicao,
    descricao_alimentos,
    data_hora: normalizarDataHora(data_hora),
  };
}

export default class DiarioService {
  async CadastrarRefeicao(dados = {}) {
    const { id_usuario } = dados;
    if (!id_usuario) {
      throw new Error("O id do usuário é obrigatório.");
    }
    const refeicao = validarEMontar(dados);

    try {
      return await diarioRepository.criarRefeicao({ id_usuario, ...refeicao });
    } catch (error) {
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        throw new Error("Usuário não encontrado.");
      }
      throw error;
    }
  }

  async ListarRefeicoes(id_usuario, data, limit, offset) {
    if (!id_usuario) {
      throw new Error("O id do usuário é obrigatório.");
    }
    if (data && !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      throw new Error("Data inválida. Use o formato AAAA-MM-DD.");
    }
    const { rows, total } = await diarioRepository.buscarRefeicoesPorUsuario(
      id_usuario,
      data || null,
      limit,
      offset,
    );
    return { refeicoes: rows, total };
  }

  async ListarDicasParaAcompanhante(id_gestante, user, limit, offset) {
    try {
      if (!id_gestante) {
        const error = new Error();
        error.message =
          "Gestante não informada para a busca do diário alimentar!";
        error.camposFaltando = true;
        throw error;
      }

      return await diarioRepository.ListarDicasParaAcompanhante(
        id_gestante,
        user.id_usuario,
        limit,
        offset,
      );
    } catch (error) {
      throw error;
    }
  }

  async AlterarRefeicao(id_refeicao, dados = {}) {
    const existente = await diarioRepository.buscarRefeicaoPorId(id_refeicao);
    if (!existente) {
      throw new Error("Refeição não encontrada.");
    }
    const refeicao = validarEMontar(dados);
    return await diarioRepository.atualizarRefeicao(id_refeicao, refeicao);
  }

  async RemoverRefeicao(id_refeicao) {
    const refeicao = await diarioRepository.removerRefeicao(id_refeicao);
    if (!refeicao) {
      throw new Error("Refeição não encontrada.");
    }
    return refeicao;
  }
}