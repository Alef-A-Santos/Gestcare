import connectDB from "../database/db.js";
import AcompanhantesRepository from "../repository/acompanhantes.repository.js";

const acompanhantesRepository = new AcompanhantesRepository();

export default class AcompanhantesService {
  async Listar() {
    try {
      const response = await acompanhantesRepository.Listar();
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async ListarAcompanhantesGestante(user) {
    try {
      if (!user) {
        const error = new Error("Gestante não identificada!");
        error.hasMissingValues = true;
        throw error;
      }
      const response =
        await acompanhantesRepository.ListarAcompanhantesGestante(user);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async Cadastrar(dados, user) {
    let db;
    try {
      if (!dados || !dados.id_usuario || !dados.email) {
        const error = new Error("Dados do usuário não inseridos!");
        error.hasMissingValues = true;
        throw error;
      }
      db = await connectDB();
      //Na consulta abaixo, o email é o email do acompanhante que vai vim do objeto dados
      // Essa consulta serve para verificar se usuário do acompanhante existe
      const resultUser = await db.query(
        "SELECT COUNT(id_usuario) as qtd_usuarios FROM usuarios WHERE email = ?",
        [dados.email],
      );
      if (!resultUser[0][0].qtd_usuarios) {
        const error = new Error("Usuário não encontrado!");
        error.userNonExistent = true;
        throw error;
      }

      //Na consulta abaixo, o email é o email do usuário(gestante) que vai vim do objeto dados
      // Essa consulta serve para verificar se a gestante já atingiu o limite de acompanhnates(2)
      const resultAcomp = await db.query(
        `SELECT COUNT(id_gestante) AS num_acompanhantes 
          FROM acompanhantes 
          WHERE id_gestante = ?`,
        [user.id_usuario],
      );
      if (resultAcomp[0][0].num_acompanhantes == 2) {
        const error = new Error("Número máximo de acompanhantes atingido!");
        error.hasMaxAcompanhantes = true;
        throw error;
      }

      const response = await acompanhantesRepository.Cadastrar(dados, user);
      return { mensagem: response };
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async Remover(id) {
    let db;
    try {
      if (!id) {
        const error = new Error("Usuário não escolhido!");
        error.hasMissingValues = true;
        throw error;
      }
      db = await connectDB();
      const [result] = await db.query(
        "SELECT id_acompanhante FROM acompanhantes WHERE id_acompanhante = ?",
        [id],
      );
      if (!result.length) {
        const error = new Error("Usuário não identificado!");
        error.userNonExistent = true;
        throw error;
      }

      const response = await acompanhantesRepository.Remover(id);
      return { mensagem: response };
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async Editar(id_antigo_acompanhante, id_novo_acompanhante, user) {
    let db;
    try {
      if (!id_antigo_acompanhante || !id_novo_acompanhante || !user) {
        const error = new Error("Dados não especificados!");
        error.hasMissingValues = true;
        throw error;
      }
      db = await connectDB();
      let [result] = await db.query(
        "SELECT id_acompanhante FROM acompanhantes WHERE id_acompanhante = ?",
        [id_antigo_acompanhante],
      );
      if (!result.length) {
        const error = new Error("Antigo acompanhante não identificado!");
        error.userNonExistent = true;
        throw error;
      }

      [result] = await db.query(
        "SELECT id_usuario FROM usuarios WHERE id_usuario = ?",
        [id_novo_acompanhante],
      );
      if (!result.length) {
        const error = new Error("Novo acompanhante não identificado!");
        error.userNonExistent = true;
        throw error;
      }

      const response = await acompanhantesRepository.Editar(
        id_antigo_acompanhante,
        id_novo_acompanhante,
        user,
      );
      return { mensagem: response };
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (db) db.release();
    }
  }
}
