import InputHome from "../components/InputHome";
import Logo from "../components/Logo";
import Botao from "../components/Botao";

import fundo from "../assets/imagem/fundo2.png";
import logoRosa from "../assets/logos/logo_rosa.png";
import fundoRosa from "../assets/imagem/FundoRosa.png";
function Home() {
  return (
    <div>
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="m-2 flex w-20 md:w-35 h-1/2 absolute">
          <Logo img={logoRosa} />
        </div>

        {/* LADO ESQUERDO */}

        <div
          className="w-full md:w-AUTO h-screen p-8 text-white  bg-cover bg-right hidden lg:flex"
          style={{ backgroundImage: `url("${fundo}")` }}
        ></div>

        {/* LADO DIREITO */}

        <main
          className="w-dvw  lg:w-1/2 min-h-dvh flex items-center justify-center bg-[#f7cccc] p-4 object-cover"
          style={{
            backgroundImage: `url("${fundoRosa}")`,
            backgroundSize: "cover",
          }}
        >
          <div className="w-full h-full flex flex-col justify-center gap-5">
            <h2 className="font-body text-center text-3xl  text-teal-500 mt-12">
              <b>Entrar na sua conta:</b>

              <p className="font-body text-sm text-gray-500 font-bold">
                Acompanhe sua gravidez com segurança
              </p>
            </h2>

            <InputHome />

            <Botao
              className="text-center bg-teal-500 hover:bg-teal-600 font-bold text-white rounded-lg py-3 m-2 w-full cursor-pointer"
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
