import connectDB from "../database/db.js";

export default class DiarioRepository {
  async criarRefeicao({ id_usuario, tipo_refeicao, descricao_alimentos, data_hora }) {
    let db;
    try {
      db = await connectDB();
      const [result] = await db.query(
        `INSERT INTO diario_alimentar
           (id_usuario, tipo_refeicao, descricao_alimentos, data_hora)
         VALUES (?, ?, ?, ?)`,
        [id_usuario, tipo_refeicao, descricao_alimentos, data_hora]
      );
      const [rows] = await db.query(
        `SELECT * FROM diario_alimentar WHERE id_refeicao = ?`,
        [result.insertId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }

  async buscarRefeicoesPorUsuario(id_usuario, data = null) {
    let db;
    try {
      db = await connectDB();
      let sql = `SELECT * FROM diario_alimentar WHERE id_usuario = ? AND ativo = 1`;
      const params = [id_usuario];

      if (data) {
        // intervalo em vez de DATE(data_hora) para aproveitar índices
        sql += ` AND data_hora >= ? AND data_hora < DATE_ADD(?, INTERVAL 1 DAY)`;
        params.push(data, data);
      }

      sql += ` ORDER BY data_hora DESC`;
      const [rows] = await db.query(sql, params);
      return rows;
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }

  async ListarDicasParaAcompanhante(id_gestante, id_acompanhante){
    let db;
    try {
      db = await connectDB();
      const [diario] = await db.query(`
        SELECT da.tipo_refeicao, da.descricao_alimentos, da.data_hora 
        FROM diario_alimentar da 
          INNER JOIN usuarios u ON da.id_usuario = u.id_usuario 
          INNER JOIN acompanhantes a ON a.id_gestante = u.id_usuario
        WHERE a.id_acompanhante = ? AND a.id_gestante = ? `,[id_acompanhante, id_gestante]);

      return diario;
    } catch (error) {
      throw error;
    }finally{
      if(db) db.release();
    }
  }

  async buscarRefeicaoPorId(id_refeicao) {
    let db;
    try {
      db = await connectDB();
      const [rows] = await db.query(
        `SELECT * FROM diario_alimentar WHERE id_refeicao = ? AND ativo = 1`,
        [id_refeicao]
      );
      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }

  async atualizarRefeicao(id_refeicao, { tipo_refeicao, descricao_alimentos, data_hora }) {
    let db;
    try {
      db = await connectDB();
      await db.query(
        `UPDATE diario_alimentar
            SET tipo_refeicao = ?, descricao_alimentos = ?, data_hora = ?
          WHERE id_refeicao = ? AND ativo = 1`,
        [tipo_refeicao, descricao_alimentos, data_hora, id_refeicao]
      );
      const [rows] = await db.query(
        `SELECT * FROM diario_alimentar WHERE id_refeicao = ?`,
        [id_refeicao]
      );
      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }

  // remoção lógica: mantém o histórico e segue o padrão da coluna `ativo` do banco
  async removerRefeicao(id_refeicao) {
    let db;
    try {
      db = await connectDB();
      const [rows] = await db.query(
        `SELECT * FROM diario_alimentar WHERE id_refeicao = ? AND ativo = 1`,
        [id_refeicao]
      );
      if (!rows[0]) return undefined;

      await db.query(
        `UPDATE diario_alimentar SET ativo = 0 WHERE id_refeicao = ?`,
        [id_refeicao]
      );
      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async buscarRefeicoesDia(id_gestante) {
    let db;
    try {
      db = await connectDB();
      const [refeicoes] = await db.query(`SELECT tipo_refeicao, descricao_alimentos FROM diario_alimentar WHERE id_usuario = ? AND DATE(data_hora) = DATE(NOW())`, [id_gestante]);
      return refeicoes; 
    } catch (error) {
      throw error;
    }finally {
      if(db) db.release();
    }
  }
}