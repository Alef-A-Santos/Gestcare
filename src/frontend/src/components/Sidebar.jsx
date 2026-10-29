import { IoHomeOutline, IoSettingsOutline, IoMenu, IoClose, IoLogOutOutline, IoPerson } from "react-icons/io5";
import { VscSettingsCompact } from "react-icons/vsc";
import { LuSalad, LuNotebookPen } from "react-icons/lu";
import { FaRegBell } from "react-icons/fa";
import { BsTelephone } from "react-icons/bs";
import { useState, useEffect } from "react";
import UserName from "./UserName";
import SidebarItens from "./SidebarItens";
import { useNavigate } from "react-router-dom";
 
// Ajuste os caminhos (to) para os mesmos do seu App.jsx
const itens = [
  { rotulo: "Início", icone: IoHomeOutline, to: "/home" },
  { rotulo: "Histórico Glicêmico", icone: VscSettingsCompact, to: "/historico" },
  { rotulo: "Diário Alimentar", icone: LuSalad, to: "/diario" },
  { rotulo: "Lembretes", icone: FaRegBell, to: "/lembretes" },
  { rotulo: "Números de Emergência", icone: BsTelephone, to: "/emergencia" },
  { rotulo: "Dicas Educativas", icone: LuNotebookPen, to: "/dicas" },
  { rotulo: "Ajustes", icone: IoSettingsOutline, to: "/ajustes" },
];
 
function Sidebar({ nome = "Maria Fonseca", semanas = 22 }) {
  const navigate = useNavigate();
  const [foto, setFoto] = useState(null);
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
 
  // Abre no desktop e fecha no mobile quando a tela muda de tamanho
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const aoMudar = (e) => setIsOpen(e.matches);
    mq.addEventListener("change", aoMudar);
    return () => mq.removeEventListener("change", aoMudar);
  }, []);
 
  const toggleSidebar = () => setIsOpen(!isOpen);
 
  // No mobile, fecha o menu depois de escolher uma página
  const fecharNoMobile = () => {
    if (window.innerWidth < 768) setIsOpen(false);
  };
 
  const handleLogout = () => navigate("/");
 
  return (
    <div className="shrink-0">
      {/* Botão de abrir no mobile quando estiver fechado */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-3 bg-teal-500 text-white rounded-xl shadow-lg md:hidden hover:bg-teal-600"
          aria-label="Abrir Menu"
        >
          <IoMenu size={26} />
        </button>
      )}
 
      {/* Fundo escuro no mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}
 
      {/* Menu Lateral: sempre com a altura da tela (h-screen) e fixo ao rolar (sticky) */}
      <aside
        className={`bg-teal-500 p-4 flex flex-col h-screen overflow-y-auto text-white transition-all duration-300 z-40 fixed top-0 left-0 md:sticky ${
          isOpen
            ? "w-96 lg:w-96 max-w-[85vw] translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-20"
        }`}
      >
        {/* Botão de Expandir/Recolher no Topo */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-teal-600 transition cursor-pointer"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <IoClose size={30} /> : <IoMenu size={30} />}
          </button>
        </div>
 
        {/* Perfil e Boas-Vindas */}
        {isOpen && (
          <div className="flex flex-col items-center justify-center gap-2 mb-6">
            <label className="rounded-full w-24 h-24 bg-white overflow-hidden cursor-pointer flex items-center justify-center border-4 border-pink-300 shadow">
              {foto ? (
                <img src={foto} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <IoPerson className="text-5xl text-zinc-400" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFoto(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </label>
 
            <UserName
              className="text-2xl font-playfair font-bold text-center mt-3"
              nome={nome}
            />
 
            <h4 className="text-xl mt-2 text-center font-poppins">
              Sua Gestação:{" "}
              <span className="font-bold">{semanas} Semanas</span>
            </h4>
            <hr className="w-3/4 border-white/40 mt-2" />
          </div>
        )}
 
        {/* Lista de Itens do Menu */}
        <nav className="flex-1 flex flex-col gap-5">
          {itens.map((item) => (
            <SidebarItens
              key={item.to}
              {...item}
              aberto={isOpen}
              aoClicar={fecharNoMobile}
            />
          ))}
        </nav>
 
        {/* Botão Sair no Rodapé */}
        <div className="mt-auto pt-4">
          <button
            type="button"
            title="Sair"
            onClick={handleLogout}
            className="w-full flex justify-center items-center gap-2 p-3 mb-4 rounded-2xl text-xl font-bold font-poppins text-white bg-pink-300 hover:scale-102 transition cursor-pointer"
          >
            {isOpen ? "Sair" : <IoLogOutOutline size={26} />}
          </button>
        </div>
      </aside>
    </div>
  );
}
 
export default Sidebar;