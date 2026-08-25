import Botao from "../components/Botao";
import InputCadastro from "../components/InputsCadastro";
import Logo from "../Components/Logo";
import fundo from "../assets/imagem/fotoDireito.png";
import fundoForm from "../assets/imagem/fotoMelhoradaGestCare.png";
import Inputs from "../components/Inputs";
import Labels from "../components/Labels";

function Cadastro() {
  return (
    <div>
      <div>
        <div className="min-h-screen flex flex-col md:flex-row ">
          {/* LADO ESQUERDO */}

          <div
            className=" hidden md:flex md:w-4/6 min-h-screen p-8 text-white bg-cover bg-left"
            style={{ backgroundImage: `url("${fundo}")` }}
          >
            <div className="m-2 flex w-35 h-80">
              <Logo img="src\assets\logos\logo-1.png" alt="Mulheres gravidas" />
            </div>
          </div>

          {/* LADO DIREITO */}

          <main
            className="w-full md:w-2/5  min-h-screen flex items-center justify-center px-6 sm:px-8 bg-cover bg-center"
            style={{ backgroundImage: `url("${fundoForm}")`}}
          >
            <div className="w-full max-w-sm flex flex-col gap-4 justify-center items-center mb-5 px-8 min-h-screen">
              <p className="font-body text-sm:3xl text-white text-center mt-10 p-2 font-bold">
                Primeiro Acesso
              </p>
              <h2 className="font-body text-center text-4xl font-bold text-white ">
                Crie sua conta
              </h2>

              <InputCadastro />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-1 m-2 text-start ">
                <div className="flex flex-col text-center p-1">
                  <Labels desc="Meta jejum (mg/dl)" className="font-bold text-center text-white" />
                  <Inputs tipoDado="number" placeName="95" className="border-2 p-2  rounded-lg bg-white border-red-300 w-full sm:w-50 outline-none  focus:border-red-400 focus:border-2 text-start mt-2 text-grey-300" />
                </div>
                <div className="flex flex-col text-center p-1">
                  <Labels desc="Meta pós-pradial" className="font-bold text-center text-white" />
                  <Inputs tipoDado="number" placeName="140" className="border-2 p-2  rounded-lg bg-white border-red-300 w-full sm:w-50 outline-none  focus:border-red-400 focus:border-2 text-start mt-2 text-grey-300" />
                </div>
              </div>


              <Botao
                className="text-center bg-teal-500 hover:bg-teal-400 font-bold text-white
             rounded-lg py-3 m-2 w-full sm:w-100 transition duration-300 px-10 "
                nome={"Cadastrar"}
              />

              <div className="text-center font-mono">
                <h3 className="text-[18px]">
                  <b className="text-white">
                    Já tem conta ?{" "}
                    <a className="underline text-teal-400 font-bold" href="#">
                      <b className=" hover:text-teal-200 transition duration-300">Entrar</b>
                    </a>
                  </b>
                </h3>

              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
