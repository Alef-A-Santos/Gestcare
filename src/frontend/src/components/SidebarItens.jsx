import { useNavigate, useLocation } from "react-router-dom";
 
function SidebarItens({ rotulo, icone: Icone, to, aberto, aoClicar }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ativo = Boolean(to) && pathname === to;
 
  const handleClick = () => {
    if (to) navigate(to);
    aoClicar?.();
  };
 
  return (
    <button
      type="button"
      onClick={handleClick}
      title={rotulo}
      aria-current={ativo ? "page" : undefined}
      className={`w-full flex items-center gap-4 py-3 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer ${
        aberto ? "justify-start px-4 text-left" : "justify-center px-0"
      } ${
        ativo
          ? "bg-pink-300 text-zinc-800 shadow"
          : "text-white hover:bg-pink-300/80 hover:shadow-lg hover:-translate-y-0.5"
      }`}
    >
      {Icone && <Icone className="text-2xl shrink-0" />}
      {aberto && (
        <span className="text-lg md:text-xl font-poppins font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          {rotulo}
        </span>
      )}
    </button>
  );
}
 
export default SidebarItens;