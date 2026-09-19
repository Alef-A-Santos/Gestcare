import DispositivosRepository from "../repository/dispositivos.repository.js";
import connectDB from "../database/db.js";

const dispositivosRepository = new DispositivosRepository();
const error = new Error();

export default class DispositivosService {
  async Listar(user) {
    try {
      const dispositivos = await dispositivosRepository.Listar(user);

      return {
        mensagem: "Dispositvos listados com sucesso!",
        dispositivos,
      };
    } catch (error) {
      throw error;
    }
  }
  async Cadastrar(user, subscription, nome) {
    if (
      !subscription 
      || !Object.keys(subscription).length 
      || !subscription.endpoint 
      || !subscription.keys 
      || !Object.keys(subscription.keys).length
    ) {
      error.hasMissingValues = true;
      error.message = "Inscrição do dispositivo é obrigatória!";
      throw error;
    }

    const response = await dispositivosRepository.Cadastrar(
      user,
      subscription,
      nome,
    );

    return {
      mensagem: `Dispositivo '${nome}' cadastrado com sucesso!`,
    };
  }
  async AlterarStatus(user, status, id) {
    let db;
    try {
      if (!id || status === null || status === undefined) {
        error.hasMissingValues = true;
        error.message = "Informe o dispositivo e o status!";
        throw error;
      }

      db = await connectDB();
      const [[dispositivo]] = await db.query(
        `SELECT COUNT(id_dispositivo) as qtd_dispositivos FROM dispositivos WHERE id_dispositivo = ? AND id_usuario = ?`,
        [id, user.id_usuario],
      );

      if (!dispositivo.qtd_dispositivos) {
        error.notFound = true;
        error.message = "Dispositivo não encontrado!";
        throw error;
      }

      const response = await dispositivosRepository.AlterarStatus(
        user,
        status,
        id,
        db,
      );

      return {
        mensagem: "Status do dispositivo atualizado com sucesso!",
      };
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async Deletar(user, id) {
    if (!id) {
      error.hasMissingValues = true;
      error.message = "Informe o dispositivo e o status!";
      throw error;
    }

    const response = await dispositivosRepository.Deletar(user, id);
    if (response.affectedRows == 0) {
      error.notSucced = true;
      error.message =
        "Falha ao deletar dispositivo!Tente novamente mais tarde.";
      throw error;
    }

    return { mensagem: "Dispositivo excluido com sucesso!" };
  }
  async Editar(user, id, dados) {
    let db;
    try {
      if ( !id || !Object.keys(dados).length || !Object.keys(dados.subscription).length) {
        error.hasMissingValues = true;
        error.message = "Informe o dispositivo e os novos dados!";

        if( !dados.subscription.endpoint 
          && !dados.subscription.keys 
          && !Object.keys(dados.subscription.keys).length) {
          error.message = "Informe a nova subscription!";
        }
        throw error;
      }

      db = await connectDB();
      const [[dispositivo]] = await db.query(
        `SELECT COUNT(id_dispositivo) as qtd_dispositivos FROM dispositivos WHERE id_dispositivo = ? AND id_usuario = ?`,
        [id, user.id_usuario],
      );

      if(!dispositivo.qtd_dispositivos) {
        error.notFound = true;
        error.message = "Dispositivo não encontrado!";
        throw error;
      }

      const response = await dispositivosRepository.Editar(user, id, dados, db);

      return { mensagem : "Dados do dispositivo alterados com sucesso!" }
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }
}
