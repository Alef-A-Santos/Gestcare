import connectDB from "../database/db.js";

export default class GlicemiaRespository {
  async Cadastrar(user, dados, db) {
    try {
      const [result] = await db.query(
        "INSERT INTO registro_glicemia(id_usuario, valor, data_hora, classificacao) values(?,?,Now(),?)",
        [user.id_usuario, dados.valor, dados.classificacao],
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
  async Listar(user, db) {
    try {
      const [rows] = await db.query(
        "SELECT id_glicemia, valor, data_hora, classificacao FROM registro_glicemia WHERE id_usuario = ? ORDER BY data_hora DESC",
        [user.id_usuario],
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async Remover(user, id, db) {
    try {
      // o id_usuario no WHERE garante que ela só apaga o próprio registro
      const [result] = await db.query(
        "DELETE FROM registro_glicemia WHERE id_glicemia = ? AND id_usuario = ?",
        [id, user.id_usuario],
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async BuscarUltimaMedicao(user) {
    let db; 
    try {
      db = await connectDB();
      const [[result]] = await db.query(`
        SELECT valor, data_hora, classificacao 
        FROM registro_glicemia 
        WHERE id_usuario = ? 
        ORDER BY data_hora DESC 
        LIMIT 1`, [user.id_usuario]);

      return result;
    }catch(error) {
      throw error;
    }
  }
  async GerarMediaUtimasSeteMedicoes(user) {
    let db;
    try {
      db = await connectDB();
      const [[result]] = await db.query(`
        SELECT ROUND(AVG(valor),2) as media
        FROM registro_glicemia 
        WHERE id_usuario = ? 
        ORDER BY data_hora DESC 
        LIMIT 7`, [user.id_usuario]);

        return result;
    }catch(error) {
      throw error;
    }
  }
}
