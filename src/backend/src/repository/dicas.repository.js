import connectDB from "../database/db.js";

export default class DicasRepository {
  async criarDica({ titulo, descricao, categoria, id_usuario }) {
    let db;
    try {
      db = await connectDB();
      const [result] = await db.query(
        `INSERT INTO dicas (titulo, descricao, categoria, id_usuario)
       VALUES (?, ?, ?, ?)`,
        [titulo, descricao, categoria, id_usuario],
      );
      const [rows] = await db.query(`SELECT * FROM dicas WHERE id = ?`, [
        result.insertId,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }

  async buscarDicas() {
    let db;
    try {
      db = await connectDB();
      const [rows] = await db.query(
        `SELECT * FROM dicas ORDER BY categoria ASC, titulo ASC`,
      );
      return rows;
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }

  async buscarDicasPorCategoria(categoria) {
    let db;
    try {
      db = await connectDB();
      const [rows] = await db.query(
        `SELECT * FROM dicas WHERE categoria = ? ORDER BY titulo ASC`,
        [categoria],
      );
      return rows;
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }

  async buscarDicasPorGestante(gestanteId) {
    let db;
    try {
      db = await connectDB();
      const [rows] = await db.query(
        `SELECT * FROM dicas WHERE id_usuario = ? ORDER BY criada_em DESC`,
        [gestanteId],
      );
      return rows;
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }

  async atualizarDica(id, { titulo, descricao, categoria }) {
    let db;
    try {
      db = await connectDB();
      await db.query(
        `UPDATE dicas SET titulo = ?, descricao = ?, categoria = ?
       WHERE id = ?`,
        [titulo, descricao, categoria, id],
      );
      const [rows] = await db.query(`SELECT * FROM dicas WHERE id = ?`, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }

  async vincularLinkDica(dicaId, link) {
    let db;
    try {
      db = await connectDB();
      await db.query(`UPDATE dicas SET link_referencia = ? WHERE id = ?`, [
        link,
        dicaId,
      ]);
      const [rows] = await db.query(`SELECT * FROM dicas WHERE id = ?`, [
        dicaId,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }

  async removerDica(id) {
    let db;
    try {
      db = await connectDB();
      const [rows] = await db.query(`SELECT * FROM dicas WHERE id = ?`, [id]);
      await db.query(`DELETE FROM dicas WHERE id = ?`, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async ListarDicasParaAcompanhante(id_gestante, id_acompanhante) {
    let db;
    try {
      db = await connectDB();
      const [dicas] = await db.query(
        `
        SELECT d.titulo, d.descricao, d.categoria, d.link_referencia 
        FROM dicas d 
          INNER JOIN usuarios u ON d.id_usuario = u.id_usuario 
          INNER JOIN acompanhantes a ON a.id_gestante = u.id_usuario
        WHERE a.id_acompanhante = ? AND a.id_gestante = ? `,
        [id_acompanhante, id_gestante],
      );
      return dicas;
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }
}
