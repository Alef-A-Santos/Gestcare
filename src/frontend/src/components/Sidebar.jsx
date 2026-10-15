import { IoHomeOutline, IoSettingsOutline, IoMenu, IoClose } from "react-icons/io5";
import { VscSettingsCompact } from "react-icons/vsc";
import { LuSalad, LuNotebookPen } from "react-icons/lu";
import { FaRegBell } from "react-icons/fa";
import { BsTelephone } from "react-icons/bs";
import { useState } from "react";
import Botao from "../components/Botao";
import UserName from "./UserName";
import SidebarItens from "./SidebarItens";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const [foto, setFoto] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div>
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

      {/* Menu Lateral */}
      <aside
        className={`bg-teal-500 p-4 flex flex-col min-h-screen text-white transition-all duration-300 z-40 ${
          isOpen
            ? "w-96 fixed md:relative left-0 top-0 translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-20 fixed md:relative"
        }`}
      >
        {/* Botão de Expandir/Recolher no Topo */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-teal-600 transition cursor-pointer"
          >
            {isOpen ? <IoClose size={30} /> : <IoMenu size={30} />}
          </button>
        </div>

        {/* Perfil e Boas-Vindas */}
        {isOpen && (
          <div className="flex flex-col items-center justify-center gap-2 mb-6">
            <label className="rounded-full w-24 h-24 bg-gray-200 overflow-hidden cursor-pointer flex items-center justify-center border-2 border-white shadow">
              {foto ? (
                <img src={foto} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVntI8W66S4tpgqvs7Hap-E5_hdgwEzn_EtkT8HnIRwh6x-s4RwUMnwWA&s=10"
                  alt="User"
                  className="w-full h-full object-cover m-2"
                />
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
            <UserName className="text-2xl font-playfair font-bold text-center m-5" nome="Maria Fonseca" />

            <h4 className="text-2xl mt-2 text-center">
              Sua Gestação: <span className="font-bold font-poppins">22 Semanas</span>
            </h4>
          </div>
        )}

        {/* Lista de Itens do Menu */}
        <div className="flex-1 flex flex-col gap-2">
          <SidebarItens rotulo={isOpen ? "Início" : ""} icone={IoHomeOutline} />
          <SidebarItens rotulo={isOpen ? "Histórico Glicêmico" : ""} icone={VscSettingsCompact} />
          <SidebarItens rotulo={isOpen ? "Diário Alimentar" : ""} icone={LuSalad} />
          <SidebarItens rotulo={isOpen ? "Lembretes" : ""} icone={FaRegBell} />
          <SidebarItens rotulo={isOpen ? "Emergência" : ""} icone={BsTelephone} />
          <SidebarItens rotulo={isOpen ? "Dicas Educativas" : ""} icone={LuNotebookPen} />
          <SidebarItens rotulo={isOpen ? "Ajustes" : ""} icone={IoSettingsOutline} />
        </div>

        {/* Botão Sair no Rodapé */}
        <div className="mt-auto pt-4">
          <Botao
            className="w-full flex justify-center items-center p-3 rounded-2xl text-xl font-bold font-poppins hover:bg-pink-300 transition cursor-pointer"
            nome={isOpen ? "Sair" : ""}
            clickHandler={handleLogout}
          />
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;