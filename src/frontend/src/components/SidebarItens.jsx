import Botao from "../components/Botao";

function SidebarItens({ rotulo, icone: Icone }) {
  const temRotulo = Boolean(rotulo && rotulo.trim() !== "");

  return (
    <div className="w-full mb-2 mt-2">
      <Botao
        className={`w-full flex items-center gap-4 py-3 rounded-2xl transition-all duration-300 hover:bg-pink-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white cursor-pointer hover:-translate-y-0.5 ${
          temRotulo
            ? "justify-start px-4 text-left"   
            : "justify-center px-0 text-center" 
        }`}
      >
        {Icone && <Icone className="text-2xl shrink-0" />}
        {temRotulo && (
          <span className="text-lg md:text-xl font-poppins font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
            {rotulo}
          </span>
        )}
      </Botao>
    </div>
  );
}

export default SidebarItens;