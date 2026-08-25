import { FaLock,FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import Botao from "./Botao";
import { useState } from "react";

function InputHome() {
  const [
    isSenha, setIsSenha

  ] = useState (false)
  return (
    <div className="w-full flex flex-col gap-1 justify-center items-center px-4">

      <label className="font-mono text-[15px] text-white font-bold">
        Email:
      </label>

      <div className="relative lg:w-100 w-80">
         <MdEmail className="absolute left-3 top-2/4 -translate-y-1/2 text-teal-500" />
        <input
         className="border p-2 pl-10 text-center rounded-lg bg-white border-red-300 w-full outline-none focus:border-red-400 focus:border-2"
          type="email"
          placeholder="Digite seu email aqui"
          required
        />
      </div>

      <label className="font-mono text-[15px] mt-5 text-white font-bold">
        Senha:
      </label>

   
      <div className="relative lg:w-100 w-80">
        <FaLock className="absolute left-3 top-2/4 -translate-y-1/2 text-teal-500" />

        <input
          className="border p-2 pl-10 text-center rounded-lg bg-white border-red-300 w-full outline-none focus:border-red-400 focus:border-2"
          type={ isSenha? "password" : "text"}
          placeholder="Digite sua senha aqui"
          required
        />
      <Botao nome={ isSenha ? <IoEyeSharp/>: <FaEyeSlash />} className={"cursor-pointer text-teal-500 absolute right-4 top-2/4 -translate-y-1/2"} clickHandler={()=> setIsSenha (!isSenha)} />
      </div>

    </div>
  );
}

export default InputHome;