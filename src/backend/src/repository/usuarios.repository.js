import connectDB from '../database/db.js';

let mensagemErro = "Erro interno do servidor.";

export default  class UsuariosRepository {
  async Listar() {
    let db;
    try { 
      db = await connectDB();
      const [result] = await db.query('SELECT id_usuario, nome, email, perfil, ativo FROM usuarios ORDER BY nome ASC');

      return result;
    }catch(error) {
      console.error(error)
      throw new Error("Falha ao listar usuários.");
    }finally{
      //Fecha a conexão com o banco de dados
      if(db) db.release();
    }
  }
  async Cadastrar(nome, email, senha, perfil) {
    let db;
    try {
      db = await connectDB();
      const [result] = await db.query("INSERT INTO usuarios(nome, email, senha, perfil) VALUES(?, ?, ?, ?)", [nome, email, senha, perfil]);
      return result;
    }catch(error) {
      console.error(error);
      mensagemErro = "Falha ao cadastrar usuário.";
      if(error.code === "ER_DUP_ENTRY") {
        mensagemErro = "Usuário já cadastrado!";
        throw  Error(JSON.stringify({erro:mensagemErro, status:400}));
      }
      throw new Error(JSON.stringify({erro:mensagemErro}));
    }finally {
      if(db) db.release();
    }
  }
  async BuscarUsuario(email, id){
    let db;
    try {
      let blocoWhere = "WHERE";
      if(email && id) {
        blocoWhere += " email = ? AND id_usuario = ?";
      } else if(email){
        blocoWhere += " email = ?";
      }else if(id) {
        blocoWhere += " id_usuario = ?";
      }


      const query = "SELECT * FROM usuarios " + blocoWhere; 
      db = await connectDB();
      const [result] = await db.query(query, [email || id]);

      return result; 
    }catch(error){
      const mensagem = error.message || "Falha ao buscar usuário";
      throw new Error(mensagem);
    }finally {
      if(db) db.release;
    }
  }
  async Deletar(id) {
    let db;
    try {
      db = await connectDB();
      const [result] = await db.query("DELETE FROM usuarios WHERE id_usuario = ?", [id]);
      return result;
    }catch(error) {
      const mensagem = error.message || "Falha ao deletar o usuário";
      throw new Error(mensagem);
    }finally{
      if(db) db.release();
    }
  }
  async Atualizar(id, { nome, email, senha, perfil, ativo }) {
    let db;
    try{
      db = await connectDB();
      const [ result ] = await  db.query("UPDATE usuarios SET nome = ?, email = ?, senha = ?, perfil = ?, ativo = ? WHERE id_usuario = ?", [nome, email, senha, perfil, ativo, id]);
      return result;
    }catch(error) {
      const mensagemErro = error.message || "Falha na atualização dos dados!";
      throw new Error(mensagemErro); 
    }finally{
      if(db) db.release();
    }
  }
}