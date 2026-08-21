import connectDB from "../database/db.js";

export default class AcompanhantesRepository {
  async Listar() {
    let db;
    try {
      db = await connectDB();
      const [result] = await db.query(
        `with gestante as (
            SELECT id_usuario,nome FROM usuarios)

            SELECT acompanhantes.id_acompanhante, usuarios.nome as nome_acompanhnate, usuarios.email as email_acompanhante, acompanhantes.id_gestante, gestante.nome as nome_gestante 
            FROM  acompanhantes inner join gestante on acompanhantes.id_gestante = gestante.id_usuario inner join usuarios on acompanhantes.id_acompanhante = usuarios.id_usuario`,
      );
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Falha ao buscar acompanhantes!");
    } finally {
      if (db) db.release();
    }
  }
  async ListarAcompanhantesGestante(user) {
    let db;
    try {
      db = await connectDB();
      const [result] = await db.query(
        `with gestante as (
            SELECT id_usuario,nome FROM usuarios)
            SELECT acompanhantes.id_acompanhante, usuarios.nome, acompanhantes.id_gestante, gestante.nome,  usuarios.perfil, usuarios.email
            FROM  acompanhantes inner join gestante on acompanhantes.id_gestante = gestante.id_usuario inner join usuarios on acompanhantes.id_acompanhante = usuarios.id_usuario
            WHERE gestante.id_usuario = ?`,
        [user.id_usuario],
      );
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Falha ao listar acompanhantes da gestante.");
    } finally {
      if (db) db.release();
    }
  }
  async Cadastrar(dadosAcompanhante, user) {
    let db;
    try {
      db = await connectDB();
      const [result] = await db.query(
        "INSERT INTO acompanhantes(id_gestante, id_acompanhante) VALUES(?, ?)",
        [user.id_usuario, dadosAcompanhante.id_usuario],
      );
      return "Acompanhante cadastrado com sucesso!";
    } catch (error) {
      console.error(error);
      throw new Error("Falha ao cadastrar acompanhante!");
    } finally {
      if (db) db.release();
    }
  }
  async Remover(id) {
    let db;
    try {
      db = await connectDB();
      const [result] = await db.query(
        "DELETE FROM acompanhantes WHERE id_acompanhante = ?",
        [id],
      );
      return "Acompanhante removido com sucesso!";
    } catch (error) {
      console.error(error);
      throw new Error("Falha ao remover acompanhante.");
    }
  }
  async Editar(id_antigo_acompanhante, id_novo_acompanhante, user) {
    let db;
    try {
      db = await connectDB();
      const [result] = await db.query(
        "UPDATE acompanhantes SET id_acompanhante = ? WHERE id_acompanhante = ? AND id_gestante = ?",
        [id_novo_acompanhante, id_antigo_acompanhante, user.id_usuario],
      );
      return "Acompanhante alterado com sucesso!";
    } catch (error) {
      console.error(error);
      throw new Error("Falha ao alterar acompanhante.");
    }
  }
}
