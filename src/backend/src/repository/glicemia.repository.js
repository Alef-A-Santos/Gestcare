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
