import { FaLock,FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import Botao from "./BotaoHome";
import { useState } from "react";


function InputHome() {
  const [
    isSenha, setIsSenha

  ] = useState (false)



  return (
 
    <div className="w-full flex flex-col ">

<form className=" flex justify-center items-center gap-1 px-4">
  <div className="flex justify-center items-center flex-col ">
    <label className="font-poppins Display text-[15px] text-white font-bold flex justify-start w-full m-2 pl-2">
        Email
      </label>

      <div className="relative lg:w-100 w-80 ">
         <MdEmail className="absolute left-3 top-2/4 -translate-y-1/2 text-teal-500 " />
        <input
         className="border p-2 pl-10 text-center rounded-lg bg-white border-red-300 w-full outline-none focus:border-red-400 focus:border-2 "
          type="email"
          placeholder="Digite seu email aqui"
          required
        />
      </div>

      <label className="font-poppins text-[15px] mt-5 text-white font-bold w-full m-2 pl-2">
        Senha
      </label>

   
      <div className="relative lg:w-100 w-80">
        <FaLock className="absolute left-3 top-1/6 -translate-y-1/2 text-teal-500" />

        <input
          className="border p-2 pl-10 text-center rounded-lg bg-white border-red-300 w-full outline-none focus:border-red-400 focus:border-2"
          type={ isSenha? "password" : "text"}
          placeholder="Digite sua senha aqui"
          required
         
        />
      <Botao tipo="button" nome={ isSenha ? <IoEyeSharp/>: <FaEyeSlash />} className={"cursor-pointer text-teal-500 absolute right-4 top-1/6 -translate-y-1/2"} clickHandler={()=> setIsSenha (!isSenha)} />

      
            <Botao
           className="text-center bg-teal-500 hover:bg-teal-600 font-bold text-white rounded-lg py-3 m-2 w-full max-w-100 cursor-pointer font-poppins mt-9"
              nome={"Entrar"}
            />
      </div>
  </div>
     </form>
    </div>
  );
}

export default InputHome;