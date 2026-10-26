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
}
