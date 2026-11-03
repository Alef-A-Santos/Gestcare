// Regras de classificação num só lugar: ajuste aqui conforme o documento do TCC.
export const LIMITES = {
  baixa: 70,        // abaixo disso = baixa (mg/dL)
  jejumAlta: 95,    // jejum a partir daqui = alta
  posAlta: 140,     // pós-prandial a partir daqui = alta
};

export function classificarGlicemia(valor, momento) {
  if (valor < LIMITES.baixa) return "baixa";
  const limiteAlta = momento === "Jejum" ? LIMITES.jejumAlta : LIMITES.posAlta;
  return valor >= limiteAlta ? "alta" : "normal";
}

export function formatarDataHora(iso) {
  const d = new Date(iso);
  const data = d.toLocaleDateString("pt-BR");
  const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${data} ${hora}`;
}