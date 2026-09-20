import connectDB from "../database/db.js";

export default class LembretesRepository {
  async ListarLembretesUsuario(user) {
    let db;
    try {
      db = await connectDB();
      const [lembretes] = await db.query("SELECT id_lembrete, titulo, horario, recorrencia, ativo FROM lembretes WHERE id_usuario = ?", [user.id_usuario]);
      return lembretes;
    }catch(error) {
      throw error;
    } finally{
      if(db) db.release();
    }
  }
  async Criar(user, dados, config, db){
    const [result] = await db.query("INSERT INTO lembretes(id_usuario, titulo, categoria, horario, recorrencia, config_node_schedule, ativo) VALUES(?, ?, ?, ?, ?, ?, 1)",[
      user.id_usuario,
      dados.titulo,
      dados.categoria,
      dados.horario,
      Array.isArray(dados.recorrencia)?dados.recorrencia.join(","):dados.recorrencia,
      JSON.stringify(config)
    ]);

    return result;    
  }
  async AlterarStatusLembrete(id, user, status, db) {
    const [result] = await db.query(`UPDATE lembretes SET ativo = ? WHERE id_lembrete = ? AND id_usuario = ?`, [
      status,
      id,
      user.id_usuario
    ]);

    return result;  
  }
  async BuscarPorId(id) {
    let db;
    try {
      db = await connectDB();
      const [[lembrete]] = await db.query(`SELECT titulo, horario, recorrencia, config_node_schedule, categoria FROM lembretes WHERE id_lembrete = ?`, [id]);

      return lembrete;
    }catch(error){
      throw error;
    }finally {
      if(db) db.release();
    }
  }
  async Deletar(id, user) {
    let db; 
    try{ 
      db = await connectDB();
      const result = await db.query(`DELETE FROM lembretes WHERE id_lembrete = ? AND id_usuario = ?`, [
        id, user.id_usuario
      ]);

      return result;
    }catch(error){
      throw error;
    }finally{ 
      if(db) db.release();
    }
  }
  async Editar(id, user, dados, novaConfig, db) {
    const campos = [
      "titulo",
      "horario",
      "recorrencia",
      "categoria", 
      "config_node_schedule"
    ] 

    // Cria uma array com as alterações baseado nos campos enviados
    const consultas = campos.
      map(campo => {
        return dados[campo] 
          ?`${campo} = ?`
          : campo === "config_node_schedule" && novaConfig 
            ? "config_node_schedule = ?":"";
      })
      .filter(consulta => consulta);
    
      // Organiza os dados do campo que serão passados para a consulta
      const dadosCampos =  campos.
      map(campo => {
        return dados[campo] 
          ? campo == 'recorrencia'
            ? dados[campo].join(",") // Recorrencia é uma array com os numeros que representam os dias, então é formatado de [1,2,3] para 1,2,3
            : dados[campo] 
          : campo === "config_node_schedule" && novaConfig 
            ? JSON.stringify(novaConfig) :"";
      })
      .filter(consulta => consulta);
      dadosCampos.push(parseInt(id), user.id_usuario);
    
      // Faz a consulta inserindo cada uma das arrays no seu respectivo lugar
      const [result] = await db.query(`UPDATE lembretes SET ${consultas.join(',')} WHERE id_lembrete = ? AND id_usuario = ?`, [...dadosCampos]);

      const [[lembreteAtualizado]] = await db.query(`SELECT titulo, categoria FROM lembretes WHERE id_lembrete = ?`, [id]);

      return lembreteAtualizado;
  }
}