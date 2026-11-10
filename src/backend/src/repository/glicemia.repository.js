import connectDB from "../database/db.js";

export default class GlicemiaRespository {
  async Cadastrar(user, dados, db) {
    try {
      const [result] = await db.query(
        `INSERT INTO registro_glicemia(id_usuario, valor, data_hora, classificacao) values(?,?,?,?)`,
        [user.id_usuario, dados.valor, dados.data_hora, dados.classificacao],
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async Listar(user, db, limit, offset) {
    try {
      const [[{ total }]] = await db.query(
        "SELECT COUNT(*) AS total FROM registro_glicemia WHERE id_usuario = ?",
        [user.id_usuario],
      );
      const [rows] = await db.query(
        `SELECT id_glicemia, valor, data_hora, classificacao
           FROM registro_glicemia
          WHERE id_usuario = ?
          ORDER BY data_hora DESC, id_glicemia DESC
          LIMIT ? OFFSET ?`,
        [user.id_usuario, limit, offset],
      );
      return { rows, total };
    } catch (error) {
      throw error;
    }
  }

  async ListarParaAcompanhante(id_gestante, id_acompanhante, limit, offset) {
    let db;
    try {
      db = await connectDB();
      const from = `
        FROM registro_glicemia rg
          INNER JOIN usuarios u ON rg.id_usuario = u.id_usuario
          INNER JOIN acompanhantes a ON a.id_gestante = u.id_usuario
        WHERE a.id_acompanhante = ? AND a.id_gestante = ?`;
      const params = [id_acompanhante, id_gestante];

      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) AS total ${from}`,
        params,
      );
      const [registros] = await db.query(
        `SELECT rg.valor, rg.data_hora, rg.classificacao ${from}
          ORDER BY rg.data_hora DESC, rg.id_glicemia DESC
          LIMIT ? OFFSET ?`,
        [...params, limit, offset],
      );

      return { registros, total };
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
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
      const [[result]] = await db.query(
        `
        SELECT valor, data_hora, classificacao 
        FROM registro_glicemia 
        WHERE id_usuario = ? 
        ORDER BY data_hora DESC 
        LIMIT 1`,
        [user.id_usuario],
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
  async GerarMediaUtimasSeteMedicoes(user) {
    let db;
    try {
      db = await connectDB();
      const [[result]] = await db.query(
        `
        SELECT ROUND(AVG(valor),2) as media
        FROM registro_glicemia 
        WHERE id_usuario = ? 
        ORDER BY data_hora DESC 
        LIMIT 7`,
        [user.id_usuario],
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}