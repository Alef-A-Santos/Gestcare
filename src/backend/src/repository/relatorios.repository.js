import connectDB from "../database/db.js";

export default class RelatoriosRepository {
  async Gerar(dados, user) {
    let db;
    try {
      db = await connectDB();
      const [registros_mais_altos] = await db.query(
        `WITH max as (
	          SELECT MAX(valor) as media, id_usuario 
            FROM registro_glicemia 
            WHERE id_usuario = ?  
            GROUP BY id_usuario)
        SELECT registro_glicemia.id_glicemia,registro_glicemia.data_hora, max.media
        FROM registro_glicemia, max
        WHERE registro_glicemia.id_usuario = max.id_usuario 
	      AND registro_glicemia.valor = max.media 
        AND data_hora BETWEEN ? AND ?;`,
        [user.id_usuario, dados.data_inicio, dados.data_fim],
      );

      const [registros_mais_baixos] = await db.query(
        `WITH min as (
	          SELECT MIN(valor) as media, id_usuario 
            FROM registro_glicemia 
            WHERE id_usuario = ?  
            GROUP BY id_usuario)
        SELECT registro_glicemia.id_glicemia,registro_glicemia.data_hora, min.media
        FROM registro_glicemia, min
        WHERE registro_glicemia.id_usuario = min.id_usuario 
	      AND registro_glicemia.valor = min.media 
        AND data_hora BETWEEN ? AND ?;`,
        [user.id_usuario, dados.data_inicio, dados.data_fim],
      );

      const [registros_periodo] = await db.query(
        `SELECT id_glicemia, valor, data_hora, classificacao FROM registro_glicemia WHERE id_usuario = ?`,
        [user.id_usuario],
      );

      /* 
      Busca do registro mais baixo/alto via reduce()
      Acho que é mais lento do que a consulta SQL 
      Confirmar com os professores

      const registro_mais_baixo = registros_periodo.reduce((registroAnterior, registroAtual) => registroAnterior.valor < registroAtual.valor?registroAnterior:registroAtual,registros_periodo[0]);

      const registro_mais_alto = registros_periodo.reduce((registroAnterior, registroAtual) => registroAnterior.valor > registroAtual.valor?registroAnterior:registroAtual,registros_periodo[0]);

      console.log(registro_mais_baixo);
      console.log(registro_mais_alto);
      */

      const [[contagem_registros]] = await db.query(
        `SELECT COUNT(id_glicemia) as qtd_registros FROM registro_glicemia WHERE id_usuario = ?`,
        [user.id_usuario],
      );

      const { media_periodo } = await this.CalcularMediaPeriodo(dados, user, db);
      const { medias: medias_semanais } = await this.CalcularMediasSemanais(dados, user, db);
      const { medias:medias_mensais } = await this.CalcularMediasMensais(dados, user, db);

      return {
        registros_periodo,
        registros_mais_altos,
        registros_mais_baixos,
        contagem_registros,
        media_periodo,
        medias_semanais,
        medias_mensais,
      };
    } catch (error) {
      throw error;
    }finally {
      if(db) db.release();
    }
  }
  async CalcularMediaPeriodo(dados, user, db){
    try {
      const [[result]] = await db.query(`SELECT AVG(valor) as media_periodo FROM registro_glicemia WHERE id_usuario = ? AND data_hora BETWEEN ? AND ?`, [user.id_usuario,dados.data_inicio, dados.data_fim]); 
      console.log(result);

      return result;
    }catch(error) {
      console.error(error);
      throw error;
    }
  }
  async CalcularMediasSemanais(dados, user, db) {
    try {
      const [[[result]]] = await db.query(`call CalcularMediaSemanal(?, ?, ?);`, [
        dados.data_inicio,
        dados.data_fim,
        user.id_usuario,
      ]);
      console.log(result);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async CalcularMediasMensais(dados, user, db) {
    try {
      const [[[result]]] = await db.query(`call CalcularMediaMensal(?, ?, ?);`,[
        dados.data_inicio,
        dados.data_fim,
        user.id_usuario,
      ]);
      console.log(result);

      return result;
    }catch(error){
      console.error(error);
      throw error;
    }
  }
}
