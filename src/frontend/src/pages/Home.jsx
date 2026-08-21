import Botao from "../components/Botao";
import InputCadastro from "../components/InputsCadastro";
import Logo from "../Components/Logo";
import fundo from "../assets/imagem/fundo2.png";
import fundoForm from "../assets/imagem/FundoRosa.png";

function Home() {
  return (
    <div>
      <div className="h-screen flex flex-col md:flex-row">
        {/* LADO ESQUERDO */}

        <div
          className="w-full md:w-3/5 h-screen p-8 text-white bg-cover bg-center"
          style={{ backgroundImage: `url("${fundo}")` }}
        >
          <div className="m-2 flex w-35 h-80">
            <Logo img="src\assets\logos\logo-1.png" alt="Mulheres gravidas" />
          </div>
        </div>

        {/* LADO DIREITO */}

        <main
          className="w-full md:w-2/5 h-screen flex items-center justify-center px-6"
          style={{ backgroundImage: `url("${fundoForm}")` }}
        >
          <div className="w-full max-w-sm flex flex-col gap-4 justify-center items-center">
            <b className="font-body text-sm text-zinc-700  text-center mt-10">
              Primeiro Acesso
            </b>
            <h2 className="font-body text-center text-4xl font-bold text-zinc-700">
              Entre em sua conta
            </h2>
            <b className="font-body text-sm text-center text-zinc-700">
              Acompanhe sua gravidez com segurança
            </b>

            <InputCadastro />

            <Botao
              className="text-center bg-teal-500 hover:bg-teal-600 font-bold text-white
             rounded-lg py-3 m-2 w-100"
              nome={"Entrar"}
            />

            <div className="text-center font-mono">
              <p>
                Ainda não tem conta?{" "}
                <a className="underline text-teal-500 font-bold" href="#">
                  Cadastre-se
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
export default Home;
