import Logo from "../Components/Logo";
import fundo from "../assets/imagem/fundoredefinir.png";
import fundoForm from "../assets/imagem/fotoMelhoradaGestcare.png";
import { Link, useNavigate } from "react-router-dom";
import logoRosa from "../assets/logos/logo_rosa.png";
import Labels from "../components/Labels";
import Inputs from "../components/Inputs";
import { FaLock } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { useState } from "react";
import Botao from "../components/BotaoCadastro";
import { testarSenha } from "../utils/verificarSenha";

function RedefinirSenha() {
      const navigate = useNavigate();

const [isSenha, setIsSenha] = useState(false);
const [isConfirmarSenha, setIsConfirmarSenha] = useState(false);
const [senha, setSenha] = useState("");
const [ConfirmarSenha, setConfirmarSenha] = useState("");
const [erroCadastro, setErroCadastro] = useState("");
const erroSenha = senha ? testarSenha(senha) || "" : "";

const erroConfirmar =
ConfirmarSenha && ConfirmarSenha !== senha
? "As senhas não coincidem"
: "";

function validar() {


if (!senha) {
  setErroCadastro("Preencha o campo senha");
  return false;
}

if (erroSenha) {
  setErroCadastro("Senha inválida");
  return false;
}

if (!ConfirmarSenha || ConfirmarSenha !== senha) {
  setErroCadastro("As senhas não coincidem");
  return false;
}

setErroCadastro("");
  navigate("/login");

return true;

}

return (


<div>

  <div className="min-h-screen flex flex-col md:flex-row">

    <div className="m-7 flex w-25 absolute">
      <Logo img={logoRosa} />
    </div>


    {/* LADO ESQUERDO */}

    <div
      className="w-full md:w-AUTO h-screen p-8 text-white bg-cover bg-left hidden lg:flex"
      style={{ backgroundImage: `url("${fundo}")` }}
    >
    </div>


    {/* LADO DIREITO */}

    <main
      className="w-full md:w-2/5 min-h-screen flex items-center justify-center px-6 rounded-lg"
      style={{ backgroundImage: `url("${fundoForm}")` }}
    >

      <div className="w-full h-full flex flex-col justify-center gap-5">

        <h2 className="font-playfair text-center text-4xl text-white mt-12">
          <b>Redefinir senha.</b>
        </h2>

        <p className="font-poppins text-center text-[20px] text-white font-bold m-3">
          Crie sua nova senha
        </p>


        {/* SENHA */}

        <div className="w-96 flex flex-col justify-center lg:justify-start items-center relative mx-auto">

          <Labels
            desc="Senha"
            className="text-white font-poppins font-bold sm:text-center flex justify-start items-center m-1 pl-2"
          />

          <Inputs
            tipoDado={isSenha ? "text" : "password"}
            placeName="Crie sua senha aqui"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            icone={
              <FaLock className="absolute text-teal-500 m-5" />
            }
            icone2={
              <Botao
                nome={isSenha ? <IoEyeSharp /> : <FaEyeSlash />}
                className="cursor-pointer text-teal-500 absolute right-10 top-2/4 -translate-y-6/10 m-1"
                clickHandler={() => setIsSenha(!isSenha)}
                tipoDado="button"
              />
            }
            className="border-2 p-3 text-start rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-grey-300 pl-11 pr-6"
          />

          {erroSenha && (
            <p className="text-white text-sm mt-1 text-center font-bold w-full">
              {erroSenha}
            </p>
          )}

        </div>


        {/* CONFIRMAR SENHA */}

        <div className="w-96 flex flex-col justify-center lg:justify-start items-center relative mx-auto">

          <Labels
            desc="Confirme sua senha"
            className="text-white font-poppins font-bold sm:text-center flex justify-start items-center m-1 pl-2"
          />

          <Inputs
            tipoDado={isConfirmarSenha ? "text" : "password"}
            placeName="Confirme sua senha aqui"
            value={ConfirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            icone={
              <FaLock className="absolute text-teal-500 m-5" />
            }
            icone2={
              <Botao
                nome={
                  isConfirmarSenha
                    ? <IoEyeSharp />
                    : <FaEyeSlash />
                }
                className="cursor-pointer text-teal-500 absolute right-10 top-2/4 -translate-y-6/10 m-1"
                clickHandler={() =>
                  setIsConfirmarSenha(!isConfirmarSenha)
                }
                tipoDado="button"
              />
            }
            className="border-2 p-3 text-start rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-grey-300 pl-11 pr-6"
          />

          {erroConfirmar && (
            <p className="text-white text-sm mt-1 text-center font-bold w-full">
              {erroConfirmar}
            </p>
          )}

        </div>


        {/* ERRO GERAL */}

        {erroCadastro && (
          <p className="text-white text-center font-bold font-playfair">
            {erroCadastro}
          </p>
        )}


        {/* BOTÃO */}

        <div className="flex justify-center">

          <Botao
            nome="Redefinir senha"
            tipoDado="button"
            clickHandler={validar}
            className="bg-teal-500 text-white font-poppins font-bold py-3 px-8 rounded-lg cursor-pointer"
          />

        </div>


        <div className="text-center font-poppins text-white text-[16px]">

          <Link
            className="hover:underline text-white font-bold"
            to="/login"
          >
            Voltar ao login
          </Link>

        </div>

      </div>

    </main>

  </div>

</div>


);
}

export default RedefinirSenha;
