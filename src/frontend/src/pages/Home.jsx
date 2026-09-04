

import Botao from "../components/BotaoCadastro";

import Logo from "../Components/Logo";
import fundo from "../assets/imagem/Fundo1.png";
import fundoForm from "../assets/imagem/fotoMelhoradaGestcare.png";
import { Link } from 'react-router-dom';
import InputHome from "../components/InputHome";



import logoRosa from "../assets/logos/logo_rosa.png";

function Home() {
  return (
    <div>
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="m-7 flex w-25 absolute">
          <Logo img={logoRosa} />
        </div>

        {/* LADO ESQUERDO */}

        <div
          
          className="w-full md:w-AUTO h-screen p-8 text-white  bg-cover bg-left hidden lg:flex"
          style={{ backgroundImage: `url("${fundo}")` }}
        ></div>

        {/* LADO DIREITO */}

        <main
          className="w-full md:w-2/5 min-h-screen flex items-center justify-center px-6 rounded-lg"
          style={{ backgroundImage: `url("${fundoForm}")` }}
        >
        
          <div className=" w-full h-full flex flex-col justify-center gap-5">
            <h2 className=" font-playfair text-center text-3xl  text-white mt-12">
              <b>Olá! Que bom ter você com a gente.</b>

             
            </h2>

            <InputHome />

            <Botao
           className="text-center bg-teal-500 hover:bg-teal-600 font-bold text-white rounded-lg py-3 m-2 w-full max-w-100 cursor-pointer font-poppins"
              nome={"Entrar"}
            />

         
             
             
            <div className="text-center font-poppins  text-white text-[16px] ">
              <p>
                Ainda não tem conta?{" "}
                  <Link className="underline text-white font-bold " to="/cadastro">Cadastre-se</Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
export default Home;
