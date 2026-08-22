import Botao from "../components/Botao";
import InputCadastro from "../components/InputsCadastro";
import Logo from "../Components/Logo";
import fundo from "../assets/imagem/fundo2.png";
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
            className="w-full md:w-3/5 min-h-screen p-8 text-white bg-cover bg-center"
            style={{ backgroundImage: `url("${fundo}")` }}
          >
            <div className="m-2 flex w-35 h-80">
              <Logo img="src\assets\logos\logo-1.png" alt="Mulheres gravidas" />
            </div>
          </div>

          {/* LADO DIREITO */}

          <main
            className="w-full md:w-2/5  min-h-screen flex items-center justify-center px-6"
            style={{ backgroundImage: `url("${fundoForm}")` }}
          >
            <div className="w-full max-w-sm flex flex-col gap-4 justify-center items-center mb-5">
              <p className="font-body text-sm text-white  text-center mt-10 font-bold">
                Primeiro Acesso
              </p>
              <h2 className="font-body text-center text-4xl font-bold text-white ">
                Crie sua conta
              </h2>
              <p className="font-body text-sm text-center text-white font-bold">
                Leva menos de um minuto
              </p>

              <InputCadastro />
              <div className="flex gap-1 m-2">
                <div className="flex flex-col text-center p-1">
                  <Labels desc="META JEJUM (MG/DL)" className="font-bold text-center text-white" />
                  <Inputs tipoDado="number" placeName="95" className="border p-2 text-center rounded-lg bg-white border-red-300 w-50 outline-none  focus:border-red-400 focus:border-2 text-center mt-2" />
                </div>
                <div className="flex flex-col text-center p-1">
                  <Labels desc="META PÓS-PRADIAL" className="font-bold text-center text-white" />
                  <Inputs tipoDado="number" placeName="140" className="border p-2 text-center rounded-lg bg-white border-red-300 w-50 outline-none  focus:border-red-400 focus:border-2 text-center mt-2" />
                </div>
              </div>



              <Botao
                className="text-center bg-teal-500 hover:bg-teal-600 font-bold text-white
             rounded-lg py-3 m-2 w-100"
                nome={"Cadastrar"}
              />

              <div className="text-center font-mono">
                <b className="text-white">
                  Já tem conta ?{" "}
                  <a className="underline text-teal-400 font-bold" href="#">
                    <b>Entrar</b>
                  </a>
                </b>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
