const ESTILOS = {
  normal: { rotulo: "Normal", fundo: "bg-emerald-200 text-emerald-900", ponto: "bg-emerald-600" },
  alta:   { rotulo: "Alta",   fundo: "bg-red-300 text-red-900",         ponto: "bg-red-600" },
  baixa:  { rotulo: "Baixa",  fundo: "bg-yellow-200 text-yellow-900",   ponto: "bg-yellow-600" },
};

function StatusBadge({ status }) {
  const estilo = ESTILOS[status] ?? ESTILOS.normal;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-sm font-poppins font-semibold ${estilo.fundo}`}
    >
      <span className={`w-2 h-2 rounded-full ${estilo.ponto}`} aria-hidden="true" />
      {estilo.rotulo}
    </span>
  );
}

export default StatusBadge;