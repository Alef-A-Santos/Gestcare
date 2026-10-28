const estilos = {
  Baixa: "bg-amber-200 text-amber-800",
  Normal: "bg-teal-100 text-teal-700",
  Alta: "bg-rose-200 text-rose-700",
};
 
function Badge({ nivel }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-lg font-poppins font-medium ${
        estilos[nivel] ?? "bg-zinc-100 text-zinc-500"
      }`}
    >
      <span className="text-xs">●</span>
      {nivel}
    </span>
  );
}
 
export default Badge;