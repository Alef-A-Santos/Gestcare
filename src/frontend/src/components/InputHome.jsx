import { FaLock,FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import Botao from "./BotaoHome";
import { useEffect, useState } from "react";


function InputHome() {
  const [
    isSenha, setIsSenha

  ] = useState (false)

  const[
    dados ,setdados
  ]=useState({ email:"",
    senha:""

  })
  async function enviar(e){
    e.preventDefault()
    try{
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify({dados})
      }) 
      console.log(response) 
      console.log(dados)
      if(!response.ok){
        throw new Error ("Falha ao relizar login")
      }
    } catch(Error){
      console.log(Error)
    }

  }
  function handleChange(e){
    const nome=e.target.name 
    const dadosAtuais = {... dados}
    dadosAtuais[nome] = e.target.value
    setdados(dadosAtuais)
  }


useEffect(()=>{
  console.log(dados)
}, [dados])
  return (
 
    <div className="w-full flex flex-col ">

<form className=" flex justify-center items-center gap-1 px-4" onSubmit={enviar}>
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
          name="email"
          onChange={handleChange}
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
          name="senha"
          onChange={handleChange}
         
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