
import { MdEmail } from "react-icons/md";
import Botao from "./Botao";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InputRec() {

  const navegar = useNavigate();

  const [dados, setdados] = useState({
    email: ""
  });



async function enviar(e) {
  e.preventDefault();

  if (!dados.email.trim()) {
    return;
  }


  localStorage.setItem("emailRecuperacao", dados.email);

  const emailSalvo = localStorage.getItem("emailRecuperacao");


  console.log("Email salvo no LocalStorage:", emailSalvo);

  navegar("/RecSenha/Verificacao", {
    state: {
      email: dados.email
    }
  });
}

  function handleChange(e) {

    const nome = e.target.name;

    const dadosAtuais = {
      ...dados
    };

    dadosAtuais[nome] = e.target.value;

    setdados(dadosAtuais);
  }

  useEffect(() => {
    console.log("Dados:", dados);
  }, [dados]);

  return (
    <div className="w-full flex flex-col">

      <form
        className="flex justify-center items-center gap-1 px-4"
        onSubmit={enviar}
      >

        <div className="flex justify-center items-center flex-col">

          <label className="font-poppins Display text-[15px] text-white font-bold flex justify-start w-full m-2 pl-2">
            Email
          </label>

          <div className="relative lg:w-100 w-80">

            <MdEmail className="absolute left-3 top-2/4 -translate-y-1/2 text-teal-500" />

            <input
              className="border p-2 pl-10 text-center rounded-lg bg-white border-red-300 w-full outline-none focus:border-red-400 focus:border-2"
              type="email"
              placeholder="Digite seu email aqui"
              required
              name="email"
              value={dados.email}
              onChange={handleChange}
            />

          </div>

          <div className="relative lg:w-100 w-80">

            <Botao
              className="text-center bg-teal-500 hover:bg-teal-600 font-bold text-white rounded-lg py-3 m-2 w-full max-w-100 cursor-pointer font-poppins mt-9"
              nome={"Redefinir senha"}
              tipoDado={"submit"}
            />

          </div>

        </div>

      </form>

    </div>
  );
}

export default InputRec;
