const LIMIT_PADRAO = 10;
const LIMIT_MAXIMO = 50;

// lê ?limit=10&offset=0 da query string e sanitiza os valores
export function lerPaginacao(query = {}) {
  let limit = parseInt(query.limit, 10);
  let offset = parseInt(query.offset, 10);

  if (!Number.isInteger(limit) || limit < 1) limit = LIMIT_PADRAO;
  if (limit > LIMIT_MAXIMO) limit = LIMIT_MAXIMO;
  if (!Number.isInteger(offset) || offset < 0) offset = 0;

  return { limit, offset };
}

// devolve os dados de paginação já com as URLs prontas para o front
export function montarPaginacao(req, total, limit, offset) {
  const base = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;

  // mantém os outros filtros da query (ex.: ?data=2026-11-05)
  const montarUrl = (novoOffset) => {
    const params = new URLSearchParams(req.query);
    params.set("limit", limit);
    params.set("offset", novoOffset);
    return `${base}?${params.toString()}`;
  };

  const totalPaginas = Math.ceil(total / limit);
  const ultimoOffset = totalPaginas > 0 ? (totalPaginas - 1) * limit : 0;

  return {
    total,
    limit,
    offset,
    pagina_atual: Math.floor(offset / limit) + 1,
    total_paginas: totalPaginas,
    primeira: montarUrl(0),
    anterior: offset > 0 ? montarUrl(Math.max(offset - limit, 0)) : null,
    proxima: offset + limit < total ? montarUrl(offset + limit) : null,
    ultima: montarUrl(ultimoOffset),
  };
}