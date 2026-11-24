import { LuMonitor, LuMoon, LuSun } from "react-icons/lu";

const OPCOES = [
  { valor: "system", icone: LuMonitor, rotulo: "Tema do sistema" },
  { valor: "dark", icone: LuMoon, rotulo: "Tema escuro" },
  { valor: "light", icone: LuSun, rotulo: "Tema claro" },
];

// Estático: "tema" e "aoTrocar" são opcionais, para quem for ligar a funcionalidade depois
function ThemeToggle({ aberto, tema = "light", aoTrocar }) {
  // Sidebar recolhida: só um botão com o ícone do tema atual
  if (!aberto) {
    const atual = OPCOES.find((o) => o.valor === tema) ?? OPCOES[2];
    const Icone = atual.icone;

    return (
      <button
        type="button"
        title={atual.rotulo}
        aria-label={atual.rotulo}
        className="w-full flex justify-center items-center p-3 rounded-2xl bg-teal-600/60 hover:bg-teal-600 transition cursor-pointer"
      >
        <Icone size={20} />
      </button>
    );
  }

  // Sidebar aberta: seletor com 3 opções
  return (
    <div
      role="group"
      aria-label="Tema"
      className="flex gap-1 p-1 rounded-2xl bg-teal-600/60"
    >
      {OPCOES.map(({ valor, icone: Icone, rotulo }) => {
        const ativo = tema === valor;

        return (
          <button
            key={valor}
            type="button"
            title={rotulo}
            aria-label={rotulo}
            aria-pressed={ativo}
            onClick={() => aoTrocar?.(valor)}
            className={`flex-1 flex justify-center items-center py-2 rounded-xl transition cursor-pointer ${
              ativo
                ? "bg-teal-300 text-white shadow"
                : "text-white/80 hover:bg-teal-600 hover:text-white"
            }`}
          >
            <Icone size={20} />
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;