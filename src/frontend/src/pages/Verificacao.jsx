import InputEmail from "../components/inputEmail";
import Logo from "../Components/Logo";
import logoRosa from "../assets/logos/logo_rosa.png";
import Botao from "../components/BotaoCadastro";
import fundo from "../assets/imagem/fundo3.png";
import fundoForm from "../assets/imagem/fotoMelhoradaGestcare.png";

function Verificacao() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="min-h-screen w-full flex flex-col lg:flex-row">

        {/* LOGO */}
        <div className="m-5 sm:m-7 flex w-25 absolute z-10">
          <Logo img={logoRosa} />
        </div>

        {/* LADO ESQUERDO */}
        <div
          className="hidden lg:flex lg:w-3/5 min-h-screen p-8 text-white bg-cover bg-left"
          style={{ backgroundImage: `url("${fundo}")` }}
        ></div>

        {/* LADO DIREITO */}
        <main
           className="w-full lg:w-2/5 min-h-screen flex items-center justify-center px-6 rounded-lg overflow-hidden bg-no-repeat md:h-screen"
          style={{ backgroundImage: `url("${fundoForm}")` }}
        >
          <div className="w-full max-w-145 min-h-screen flex flex-col justify-center gap-5 py-20">

      
            <h2 className="font-playfair text-center text-4xl  md:text-[55px] text-white mt-8 md:mb-7">
              <b>Estamos quase lá...</b>
            </h2>

            <h2 className="font-poppins text-center text-2xl md:text-[21px] text-white mt-1 px-2 w-full md:mb-5">
              <b>
                Insira o código que foi enviado em seu Email
              </b>
            </h2>

          
            <div className="w-full flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 p-2">
              <InputEmail />
              <InputEmail />
              <InputEmail />
              <InputEmail />
              <InputEmail />
              <InputEmail />
            </div>

       
            <Botao
              className="text-center bg-teal-500 hover:bg-teal-600 font-bold text-white rounded-lg py-3 m-2 w-full max-w-100 cursor-pointer font-poppins"
              nome={"Entrar"}
            />

            <div className="text-center font-poppins text-white text-sm sm:text-[16px] px-2">
              <p>
                Não recebeu o código?{" "}
                <a
                  className="underline text-white font-bold cursor-pointer"
                  href="/cadastro"
                >
                  Reenviar Código
                </a>
              </p>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}

export default Verificacao;