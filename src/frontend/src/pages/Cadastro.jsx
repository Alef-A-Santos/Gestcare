import Botao from "../components/Botao";
import InputCadastro from "../components/InputsCadastro";
import Logo from "../components/Logo";
import fundo from "../assets/imagem/fotoDireito.png";
import fundoForm from "../assets/imagem/fotoMelhoradaGestCare.png";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import logoRosa from "../assets/logos/logo_rosa.png";

function Cadastro() {
  const navigate = useNavigate();
  const cadastroRef = useRef();
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (enviando || !cadastroRef.current.validar()) {
      return;
    }

    setEnviando(true);
    const ok = await cadastroRef.current.enviar();
    setEnviando(false);

    if (ok) {
      localStorage.setItem("fluxoVerificacao", "cadastro");
      navigate("/Cadastro/Verificacao");
    }
  }

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row relative overflow-x-hidden lg:overflow-hidden">
      {/* LOGO */}
      <div className="m-7 flex w-25 absolute z-10 max-lg:brightness-0 max-lg:invert max-lg:drop-shadow-md">
  <Logo img={logoRosa} />
</div>

      {/* LADO ESQUERDO */}
      <div
        className="hidden lg:flex lg:w-3/5 lg:h-screen bg-cover bg-left"
        style={{ backgroundImage: `url("${fundo}")` }}
      />

      {/* LADO DIREITO */}
      <main
        className="w-full lg:w-2/5 min-h-screen lg:h-screen flex flex-col items-center justify-start pt-20 lg:pt-10 pb-8 px-4 sm:px-8 bg-cover lg:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ backgroundImage: `url("${fundoForm}")` }}
      >
        <form
          className="w-full max-w-sm sm:max-w-md flex flex-col gap-3 items-center"
          onSubmit={handleSubmit}
        >
          <h2 className="font-playfair text-center text-4xl sm:text-5xl font-bold text-white leading-tight">
            Crie sua conta
          </h2>

          <p className="font-playfair text-white text-center mb-3 font-bold text-xl sm:text-2xl [@media(max-height:760px)]:hidden">
            Leva menos de um minuto
          </p>

          <InputCadastro ref={cadastroRef} />

          <Botao
            className="font-poppins text-center bg-teal-500 hover:bg-teal-600 font-bold mt-3 text-white rounded-lg py-3 px-4 w-full max-w-sm transition duration-300 cursor-pointer"
            tipoDado="submit"
            nome={enviando ? "Cadastrando..." : "Cadastrar"}
          />

          <div className="text-center font-poppins w-full flex justify-center items-center gap-2 text-base">
            <p className="text-white">Já tem conta ?</p>
            <Link className="underline text-white" to="/">
              <b className="font-bold">Entrar</b>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Cadastro;