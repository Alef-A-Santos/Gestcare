import connectDB from "../database/db.js";

export default class GestcaoRepository {
  async ListarGestacoes(user) {
    let db;
    try {
      db = await connectDB();
      const [results] = await db.query(
        `SELECT * FROM gestacao WHERE id_usuario = ? ORDER BY ativo, data_criacao DESC`,
        [user.id_usuario],
      );
      return results;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async ListarGestacao(id, user) {
    let db;
    try {
      db = await connectDB();
      const [result] = await db.query(
        `SELECT * FROM gestacao WHERE id_gestacao = ? AND id_usuario = ?`,
        [id, user.id_usuario],
      );

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async CriarGestacao(dados, user, db) {
    try {
      const [result] = await db.query(
        `INSERT INTO gestacao(data_prev_parto, meta_glicemia_jejum, meta_glicemia_pos, id_usuario) VALUES(?, ?, ?, ?)`,
        [
          dados.data_prev_parto,
          dados.meta_glicemia_jejum,
          dados.meta_glicemia_pos,
          user.id_usuario,
        ],
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
  async RemoverGestacao(id_gestacao, user) {
    let db;
    try {
      db = await connectDB();

      const [result] = await db.query(
        `DELETE FROM gestacao WHERE id_gestacao = ? AND  id_usuario = ?`,
        [id_gestacao, user.id_usuario],
      );
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async FinalizarGestacao(id_gestacao, user) {
    let db;
    try {
      db = await connectDB();

      const [result] = await db.query(
        `UPDATE gestacao SET ativo = 0 WHERE id_gestacao = ? AND id_usuario = ?`,
        [id_gestacao, user.id_usuario],
      );
      return result;
    } catch (error) {
      throw error;
    }finally{
      if(db) db.release();
    }
  }
  async AlterarGestacao(id_gestacao, novosDados, user) {
   let db;
   try{
      db = await connectDB();
      const [[dadosAtuais]] = await db.query("SELECT data_prev_parto, meta_glicemia_jejum, meta_glicemia_pos FROM gestacao WHERE id_gestacao = ? AND id_usuario = ?", [id_gestacao, user.id_usuario]);

      console.log(dadosAtuais);

      const [result] = await db.query(`UPDATE gestacao SET data_prev_parto = ?, meta_glicemia_jejum = ?, meta_glicemia_pos = ? WHERE id_gestacao = ? AND id_usuario = ?`, [
         novosDados.data_prev_parto || dadosAtuais.data_prev_parto, 
         novosDados.meta_glicemia_jejum || dadosAtuais.meta_glicemia_jejum,
         novosDados.meta_glicemia_pos || dadosAtuais.meta_glicemia_pos,
         id_gestacao,
         user.id_usuario
      ]);

      return result;
   }catch(error){
      throw error;
   }finally{
       if(db) db.release();
   }
  }
}
