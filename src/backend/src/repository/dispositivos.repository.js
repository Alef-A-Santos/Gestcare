import connectDB from "../database/db.js";

export default class DispositivosRepository {
  async ListarDispositivosUsuario(user) {
    let db;
    try {
      db = await connectDB();

      const [result] = await db.query(
        `SELECT id_dispositivo, id_usuario, nome, ativo FROM dispositivos WHERE id_usuario = ?`,
        [user.id_usuario],
      );
      return result;
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async Cadastrar(user, subscription, nome) {
    let db;
    try {
      db = await connectDB();
      const [result] = await db.query(
        `INSERT INTO dispositivos(id_usuario, nome, endpoint, p256dh, expiration_time, auth, ativo) VALUES(?, ?, ?, ?, ?, ?, 1 )`,
        [
          user.id_usuario,
          nome,
          subscription.endpoint,
          subscription.keys.p256dh,
          subscription.expiration_time,
          subscription.keys.auth,
        ],
      );

      return result;
    } finally {
      if (db) db.release();
    }
  }
  async AlterarStatus(user, status, id, db) {
    const [result] = await db.query(
      `UPDATE dispositivos SET ativo = ? WHERE id_dispositivo = ? AND id_usuario = ?`,
      [status, id, user.id_usuario],
    );

    return result;
  }
  async Deletar(user, id) {
    let db;
    try {
      db = await connectDB();
      const [result] = await db.query(
        `DELETE  FROM dispositivos WHERE id_dispositivo = ? AND id_usuario = ? `,
        [id, user.id_usuario],
      );

      return result;
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }

  async Editar(user, id, dados, db) {
    const consultas = [];
    if (dados.nome) {
      consultas.push(
        `${consultas.length === 0 ? "SET" : ""} nome = '${dados.nome}'`,
      );
    }

    if (dados.subscription) {
      consultas.push(
        `${consultas.length === 0 ? "SET" : ""} endpoint = '${dados.subscription.endpoint}', p256dh = '${dados.subscription.keys.p256dh}', auth = '${dados.subscription.keys.auth}', expiration_time = ${dados.subscription.expiration_time || null}`,
      );
    }

    const consulta = consultas.join(",");

    const [result] = await db.query(
      `UPDATE dispositivos ${consulta} WHERE id_dispositivo = ? AND id_usuario = ?`,
      [id, user.id_usuario],
    );

    return result;
  }
  async ListarAtivosPorIdUsuario(user) {
    let db;
    try {
      db = await connectDB();
      const [ativos] = await db.query(
        `SELECT id_dispositivo, endpoint, p256dh, auth, expiration_time FROM dispositivos WHERE ativo = 1 AND id_usuario = ?`,[
          user.id_usuario
        ]
      );  

      const subscriptions = ativos.map((ativo) => ({
        endpoint: ativo.endpoint,
        expirationTime: ativo.expiration_time,
        keys: { p256dh: ativo.p256dh, auth: ativo.auth },
      }));

      return subscriptions;
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }
}
