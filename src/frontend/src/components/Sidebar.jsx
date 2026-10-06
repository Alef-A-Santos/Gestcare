import { IoHomeOutline } from "react-icons/io5";
import { VscSettingsCompact } from "react-icons/vsc";
import { LuSalad } from "react-icons/lu";
import { FaRegBell } from "react-icons/fa";
import { BsTelephone } from "react-icons/bs";
import { LuNotebookPen } from "react-icons/lu";
//import { FaRegUserCircle } from "react-icons/fa";
import Botao from "../components/Botao";
import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";

function Sidebar() {
  const [foto, setFoto] = useState(null);
  return (
    <div>
      <aside className="bg-teal-500 p-4 flex flex-col min-h-screen text-white">
        <div className="m-1 mb-5 p-1 md:flex md:items-center md:justify-center gap-5 sm:flex-col">
          <label className="rounded-full w-30 h-30 bg-gray-200 overflow-hidden cursor-pointer flex items-center justify-center">
            {foto ? (
              <img src={foto} className="w-full h-full object-cover" />
            ) : (
              <span><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVntI8W66S4tpgqvs7Hap-E5_hdgwEzn_EtkT8HnIRwh6x-s4RwUMnwWA&s=10" alt="User" /></span>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(evento) => {
                setFoto(URL.createObjectURL(evento.target.files[0]));
              }}
            />
          </label>
          <h4 className="text-2xl font-playfair font-bold">Maria Fonseca</h4>
        </div>
        <div className="m-2 mt-5 p-2 flex justify-center">
          <h4 className="text-2xl">
            Sua Gestação:{" "}
            <span className="font-bold font-poppins text-2xl">22 Semanas</span>
          </h4>
        </div>
        <div className="m-3 p-3 flex flex-col gap-3">
          <button className="flex justify-start items-center m-2 p-3 gap-6 rounded-2xl  hover:transition duration-700 hover:bg-pink-300 w-80 focus:outline-none focus:ring-2 focus:ring-white">
            <IoHomeOutline className="text-3xl" />
            <p className="text-2xl font-poppins font-semibold">Inicio</p>{" "}
          </button>

          <button className="flex justify-start items-center m-2 p-3 gap-6 rounded-2xl hover:transition duration-700 hover:bg-pink-300 w-80 focus:outline-none focus:ring-2 focus:ring-white">
            <VscSettingsCompact className="text-3xl" />
            <p className="text-2xl font-poppins font-semibold">
              Historico Glicemico
            </p>{" "}
          </button>

          <button className="flex justify-start items-center m-2 p-3 gap-6 rounded-2xl  hover:transition duration-700 hover:bg-pink-300 w-80 focus:outline-none focus:ring-2 focus:ring-white">
            <LuSalad className="text-3xl" />
            <p className="text-2xl font-poppins font-semibold">
              Diario Alimentar
            </p>{" "}
          </button>

          <button className="flex justify-start items-center m-2 p-3 gap-6 rounded-2xl  hover:transition duration-700 hover:bg-pink-300 w-80 focus:outline-none focus:ring-2 focus:ring-white">
            <FaRegBell className="text-3xl" />
            <p className="text-2xl font-poppins font-semibold">
              Lembretes
            </p>{" "}
          </button>

          <button className="flex justify-start items-center m-2 p-3 gap-6 rounded-2xl  hover:transition duration-700 hover:bg-pink-300 w-80 focus:outline-none focus:ring-2 focus:ring-white">
            <BsTelephone className="text-3xl" />
            <p className="text-2xl font-poppins font-semibold">
              Emergência
            </p>{" "}
          </button>

          <button className="flex justify-start items-center m-2 p-3 gap-6 rounded-2xl  hover:transition duration-1000 hover:bg-pink-300 w-80 focus:outline-none focus:ring-2 focus:ring-white">
            <LuNotebookPen className="text-3xl" />
            <p className="text-2xl font-poppins font-semibold">
              Dicas educativas
            </p>{" "}
          </button>
          <button className="flex justify-start items-center m-2 p-3 gap-6 rounded-2xl  hover:transition duration-1000 hover:bg-pink-300 w-80 focus:outline-none focus:ring-2 focus:ring-white">
            <IoSettingsOutline className="text-3xl" />
            <p className="text-2xl font-poppins font-semibold">
              Ajustes            </p>{" "}
          </button>
        </div>
        <div>
          <Botao
            className={
              "flex justify-center items-center m-2 mt-5 p-3 gap-6 rounded-2xl text-2xl font-bold font-poppins hover:transition duration-1000 hover:bg-pink-300 w-80 focus:outline-none focus:ring-2 focus:ring-white "
            }
            nome={"Sair"}
          />
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
