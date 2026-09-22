import Labels from "./Labels";
import Inputs from "./Inputs";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { useState } from "react";
import Botao from "../components/BotaoCadastro";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { testarSenha } from "../utils/verificarSenha";

function InputCadastro() {
  const [isSenha, setIsSenha] = useState(false);

  const [erroSenha, setErroSenha] = useState("");

  const[tipoUsuario, setTipoUsuario] = useState("gestante");

  return (
    <div className="flex justify-center items-center flex-col gap-1 overflow-y-hidden">
      <div className="flex">
        <div className="flex">
          <label className="text-white font-poppins font-bold flex justify-start items-center m-1 pl-2">
            Gestante
          </label>
          <input type="radio"
          name="tipoUsuario"
          checked={tipoUsuario === "gestante"}
          onChange={()=>setTipoUsuario("gestante")} 
          />
        </div>
        <div className="flex">
          <label className="text-white font-poppins font-bold flex justify-start items-center m-1 pl-2">
            Acompanhante
          </label>
          <input type="radio"
          name="tipoUsuario"
          checked={tipoUsuario === "acompanhante"}
          onChange={()=>setTipoUsuario("acompanhante")} 
          />
        </div>
      </div>



      <div className="w-100 flex flex-col justify-center items-center">
        <Labels
          desc="Nome"
          className="text-white font-poppins font-bold flex justify-start items-center m-1 pl-2"
        />

        <Inputs
          tipoDado="text"
          placeName="seu nome aqui"
          icone={<VscAccount className="absolute text-teal-500 m-4" />}
          className="border-2 p-3 rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-start text-grey-300 pl-9"
        />
      </div>

      <div className="w-96 flex flex-col justify-center lg:justify-start items-center">
        <Labels
          desc="Email"
          className="text-white font-poppins font-bold flex justify-start items-center m-1 pl-2"
        />

        <Inputs
          tipoDado="Email"
          placeName="seu email aqui"
          icone={<MdEmail className="absolute text-teal-500 m-4" />}
          className="border-2 p-3 rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-start text-grey-300 pl-9"
        />
      </div>

      <div className="w-96 flex flex-col justify-center lg:justify-start items-center relative">
        <Labels
          desc="Senha"
          className="text-white font-poppins font-bold sm:text-center flex justify-start items-center m-1 pl-2"
        />

        <Inputs
          tipoDado={isSenha ? "text" : "password"}
          placeName="Crie sua senha aqui"
          onInput={(e) => {
            setErroSenha(testarSenha(e.target.value) || "");
          }}
          icone={<FaLock className="absolute text-teal-500 m-5" />}
          icone2={
            <Botao
              nome={isSenha ? <IoEyeSharp /> : <FaEyeSlash />}
              className="cursor-pointer text-teal-500 absolute right-10 top-2/4 -translate-y-6/10 m-1"
              clickHandler={() => setIsSenha(!isSenha)}
            />
          }
          className="border-2 p-3 text-start rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-grey-300 pl-11 pr-6"
        />

        {erroSenha && (
          <p className="text-red-600 text-sm mt-1 text-center font-bold w-full">
            {erroSenha}
          </p>
        )}
      </div>
 
        {tipoUsuario === "gestante" && ( 
          <div>
        <div className="w-96 flex flex-col justify-center lg:justify-start items-center">
        <Labels
          desc="Mês da última menstruação"
          className="text-white font-poppins font-bold m-1 flex justify-start items-center pl-2 mb-1"
        />

         <Inputs
          tipoDado="month"
          icone={
            <MdCalendarMonth className="absolute text-teal-500 m-4 text-end" />
          }
          className="border-2 p-3 text-start rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-gray-500 pl-9 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-1 m-2 text-start">
        <div className="flex flex-col text-center p-1">
          <Labels
            desc="Meta jejum (mg/dl)"
            className="font-poppins font-bold text-center text-white"
          />
          <Inputs
            tipoDado="number"
            placeName="95"
            className="border-2 p-3   rounded-lg bg-white border-red-300 w-full sm:w-50 outline-none  focus:border-red-400 focus:border-2 text-start mt-2 text-grey-300"
          />
        </div>
        <div className="flex flex-col text-center p-1">
          <Labels
            desc="Meta pós-pradial"
            className="font-poppins font-bold text-center text-white"
          />
          <Inputs
            tipoDado="number"
            placeName="140"
            className="border-2 p-3  rounded-lg bg-white border-red-300 w-full sm:w-50 outline-none  focus:border-red-400 focus:border-2 text-start mt-2 text-grey-300"
          />
        </div>
      </div>
        </div>
        )}
        
      
       
      </div>
    
  );
}

export default InputCadastro;
