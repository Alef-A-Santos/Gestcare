

import Botao from "../components/BotaoCadastro";
import InputCadastro from "../components/InputsCadastro";
import Logo from "../Components/Logo";
import fundo from "../assets/imagem/fotoDireito.png";
import fundoForm from "../assets/imagem/fotoMelhoradaGestCare.png";
import Inputs from "../components/Inputs";
import Labels from "../components/Labels";
import { Link } from 'react-router-dom';


function Cadastro() {
  return (
    <div>
      <div>
        <div className="min-h-screen flex flex-col md:flex-row relative overflow-x-hidden">
          {/* LADO ESQUERDO */ }
          <div className="flex w-20 h-20  absolute m-7 md:w-full ">
            <Logo img="src\assets\logos\logo_rosa.png" alt="Logo" />
          </div>

          <div
            className="hidden lg:flex md:w-4/6 min-h-screen p-8 text-white bg-cover bg-left"
            style={{ backgroundImage: `url("${fundo}")` }}
          >
          </div>

          {/* LADO DIREITO */}

          <main
            className="w-full lg:w-2/5  min-h-screen flex items-center justify-center flex-col px-6 sm:px-8 bg-cover"
            style={{ backgroundImage: `url("${fundoForm}")` }}
          >
            <div className="w-full flex flex-col gap-4 justify-center items-center mb-5 px-8 min-h-screen">
              <h2 className="font-playfair text-center text-6xl font-bold text-white ">
                Crie sua conta
              </h2>
              <p className="font-playfair text-sm:3xl text-white text-center p-2 font-bold text-[20px]">
                Leva menos de um minuto
              </p>

              <InputCadastro />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-1 m-2 text-start">
                <div className="flex flex-col text-center p-1">
                  <Labels desc="Meta jejum (mg/dl)" className="font-poppins text-center text-white" />
                  <Inputs tipoDado="number" placeName="95" className="border-2 p-3   rounded-lg bg-white border-red-300 w-full sm:w-50 outline-none  focus:border-red-400 focus:border-2 text-start mt-2 text-grey-300" />
                </div>
                <div className="flex flex-col text-center p-1">
                  <Labels desc="Meta pós-pradial" className="font-poppins text-center text-white" />
                  <Inputs tipoDado="number" placeName="140" className="border-2 p-3  rounded-lg bg-white border-red-300 w-full sm:w-50 outline-none  focus:border-red-400 focus:border-2 text-start mt-2 text-grey-300" />
                </div>
              </div>


              <Botao
                className="font-poppins  text-center bg-teal-500 hover:bg-teal-400 font-bold text-white
             rounded-lg py-3 m-2 w-full sm:w-100 md:w-70 transition duration-300 px-10 mt-3"
                nome={"Cadastrar"}
              />

              <div className="text-center font-poppins w-full flex justify-center items-center gap-2">
              
                  <p className="text-white font-poppins text-2xl">Já tem conta ?{" "}</p>
                  <Link className="underline text-teal-400" to="/">
                   <b className="font-poppins font-bold text-3xl">Entrar</b>
                  </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
