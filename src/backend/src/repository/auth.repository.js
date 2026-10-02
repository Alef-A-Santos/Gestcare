import connectDB from "../database/db.js";

export default class AuthRepository {
  async Logar(auth, email) {
    let db;
    try {
      db = await connectDB();
      const [result] = await db.query(
        "UPDATE usuarios SET auth = ? WHERE email = ?",
        [auth, email],
      );
      return result;
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async Cadastrar(codigoValidacao, dados, db) {
    try {
      const [result] = await db.query(
        "INSERT INTO usuarios(nome, email, senha, perfil, ativo, codigo_validacao) VALUES(?, ?, ?, ?, 0, ?)",
        [dados.nome, dados.email, dados.senha, dados.perfil, codigoValidacao],
      );

      if (result.affectedRows == 0) {
        throw new Error();
      }
      const [[user]] = await db.query(
        `SELECT id_usuario FROM usuarios WHERE email = ?`,
        [dados.email],
      );

      return user;
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async Validar(auth, dados) {
    let db;
    try {
      db = await connectDB();
      const [resultUpdate] = await db.query(
        "UPDATE usuarios SET auth = ?, ativo = 1, codigo_validacao = null WHERE email = ?",
        [auth, dados.email],
      );
      const [result] = await db.query(
        "SELECT id_usuario, nome, email, perfil FROM usuarios WHERE email = ?",
        [dados.email],
      );

      return result[0];
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async ReenviarCodigo(codigoValidacao, dados) {
    let db;
    try {
      db = await connectDB();
      const [result] = await db.query(
        `UPDATE usuarios SET codigo_validacao = ? WHERE email = ?`,
        [codigoValidacao, dados.email],
      );

      setTimeout(async () => {
        await db.query(
          "UPDATE usuarios SET codigo_validacao = null WHERE email = ?",
          [dados.email],
        );
      }, 30000);

      return result;
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }
}
