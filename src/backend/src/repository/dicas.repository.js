import connectDB from "../database/db.js";

const db = await connectDB();

export async function criarDica({ titulo, descricao, categoria, id_usuario }) {
  const result = await db.query(
    `INSERT INTO dicas (titulo, descricao, categoria, id_usuario)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [titulo, descricao, categoria, Id_usuario]
  );
  return result.rows[0];
}

export async function buscarDicas() {
  const result = await db.query(
    `SELECT * FROM dicas ORDER BY categoria ASC, titulo ASC`
  );
  return result.rows;
}

export async function buscarDicasPorCategoria(categoria) {
  const result = await db.query(
    `SELECT * FROM dicas WHERE categoria = $1 ORDER BY titulo ASC`,
    [categoria]
  );
  return result.rows;
}

export async function buscarDicasPorGestante(gestanteId) {
  const result = await db.query(
    `SELECT * FROM dicas WHERE id_usuario = $1 ORDER BY criada_em DESC`,
    [gestanteId]
  );
  return result.rows;
}

export async function atualizarDica(id, { titulo, descricao, categoria }) {
  const result = await db.query(
    `UPDATE dicas SET titulo = $1, descricao = $2, categoria = $3
     WHERE id = $4 RETURNING *`,
    [titulo, descricao, categoria, id]
  );
  return result.rows[0];
}

export async function vincularLinkDica(dicaId, link) {
  const result = await db.query(
    `UPDATE dicas SET link_referencia = $1 WHERE id = $2 RETURNING *`,
    [link, dicaId]
  );
  return result.rows[0];
}

export async function removerDica(id) {
  const result = await db.query(
    `DELETE FROM dicas WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}