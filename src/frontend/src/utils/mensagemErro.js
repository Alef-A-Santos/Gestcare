export function mensagemErro(error, fallback = "Erro interno no servidor") {
  const mensagem = error?.message || fallback;
  return /failed to fetch/i.test(mensagem)
    ? "Erro interno no servidor"
    : mensagem;
}
