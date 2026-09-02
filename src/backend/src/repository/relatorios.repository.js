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
              AND data_hora BETWEEN ? AND ?
              AND YEAR(data_hora) = ?
            GROUP BY id_usuario)
        SELECT registro_glicemia.id_glicemia,registro_glicemia.data_hora, max.media
        FROM registro_glicemia INNER JOIN max ON registro_glicemia.id_usuario = max.id_usuario
        WHERE registro_glicemia.valor = max.media;
        `,
        [user.id_usuario, dados.data_inicio, dados.data_fim, dados.ano],
      );

      const [registros_mais_baixos] = await db.query(
        `WITH min as (
	          SELECT MIN(valor) as media, id_usuario 
            FROM registro_glicemia 
            WHERE id_usuario = ?  
              AND data_hora BETWEEN ? AND ?
              AND YEAR(data_hora) = ?
            GROUP BY id_usuario)
        SELECT registro_glicemia.id_glicemia,registro_glicemia.data_hora, min.media
        FROM registro_glicemia INNER JOIN min ON registro_glicemia.id_usuario = min.id_usuario
        WHERE registro_glicemia.valor = min.media ;`,
        [user.id_usuario, dados.data_inicio, dados.data_fim, dados.ano],
      );

      const [registros_periodo] = await db.query(
        `SELECT id_glicemia, valor, data_hora, classificacao 
        FROM registro_glicemia 
        WHERE id_usuario = ? 
          AND YEAR(data_hora) = ?`,
        [user.id_usuario, dados.ano],
      );

      const [[contagem_registros]] = await db.query(
        `SELECT COUNT(id_glicemia) as qtd_registros 
          FROM registro_glicemia 
          WHERE id_usuario = ?
            AND YEAR(data_hora) = ?`,
        [user.id_usuario, dados.ano],
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
      const [[result]] = await db.query(`
        SELECT AVG(valor) as media_periodo 
        FROM registro_glicemia 
        WHERE id_usuario = ? 
          AND data_hora BETWEEN ? AND ?
          AND YEAR(data_hora) = ?
        `, [user.id_usuario,dados.data_inicio, dados.data_fim, dados.ano]); 

      return result;
    }catch(error) {
      throw error;
    }
  }
  async CalcularMediasSemanais(dados, user, db) {
    try {
      const [[[result]]] = await db.query(`call CalcularMediaSemanal(?, ?, ?, ?);`, [
        dados.data_inicio,
        dados.data_fim,
        dados.ano,
        user.id_usuario,
      ]);

      return result;
    } catch (error) {
      throw error;
    }
  }
  async CalcularMediasMensais(dados, user, db) {
    try {
      const [[[result]]] = await db.query(`call CalcularMediaMensal(?, ?, ?, ?);`,[
        dados.data_inicio,
        dados.data_fim,
        dados.ano,
        user.id_usuario,
      ]);

      return result;
    }catch(error){
      throw error;
    }
  }
}
