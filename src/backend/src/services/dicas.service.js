import  DicasRepository from "../repository/dicas.repository.js";

const CATEGORIAS_VALIDAS = [
  "alimentacao",
  "glicemia",
  "exercicio",
  "medicacao",
  "sinais_de_alerta",
];
const dicasRepository = new DicasRepository()
export default class DicasService {
  async ListarDicas() {
    return await dicasRepository.buscarDicas();
  }

  async ListarDicasPorCategoria(categoria) {
    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
      throw new Error(
        `Categoria inválida. Use uma de: ${CATEGORIAS_VALIDAS.join(", ")}`
      );
    }
    return await dicasRepository.buscarDicasPorCategoria(categoria);
  }

  async ListarDicasPorUsuario(id_usuario) {
    if (!id_usuario) {
      throw new Error("O id do usuário é obrigatório.");
    }
    return await dicasRepository.buscarDicasPorUsuario(id_usuario);
  }

  async CriarDica({ titulo, descricao, categoria, id_usuario }) {
    if (!titulo || !descricao || !categoria) {
      throw new Error("Título, descrição e categoria são obrigatórios.");
    }
    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
      throw new Error(
        `Categoria inválida. Use uma de: ${CATEGORIAS_VALIDAS.join(", ")}`
      );
    }
    // id_usuario opcional: sem ele, a dica é geral (para todos os usuários)
    return await dicasRepository.criarDica({
      titulo,
      descricao,
      categoria,
      idUsuario: id_Usuario ?? null,
    });
  }

  async AlterarDica(id, { titulo, descricao, categoria }) {
    if (!titulo || !descricao || !categoria) {
      throw new Error("Título, descrição e categoria são obrigatórios.");
    }
    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
      throw new Error(
        `Categoria inválida. Use uma de: ${CATEGORIAS_VALIDAS.join(", ")}`
      );
    }
    const dica = await dicasRepository.atualizarDica(id, {
      titulo,
      descricao,
      categoria,
    });
    if (!dica) {
      throw new Error("Dica não encontrada.");
    }
    return dica;
  }

  async VincularLinkDica(id, link) {
    if (!link) {
      throw new Error("O link é obrigatório.");
    }
    try {
      new URL(link);
    } catch {
      throw new Error("O link informado não é uma URL válida.");
    }
    const dica = await dicasRepository.vincularLinkDica(id, link);
    if (!dica) {
      throw new Error("Dica não encontrada.");
    }
    return dica;
  }

  async RemoverDica(id) {
    const dica = await dicasRepository.removerDica(id);
    if (!dica) {
      throw new Error("Dica não encontrada.");
    }
    return dica;
  }
}