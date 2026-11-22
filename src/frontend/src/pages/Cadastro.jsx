import Botao from "../components/Botao";
import InputCadastro from "../components/InputsCadastro";
import Logo from "../components/Logo";
import fundo from "../assets/imagem/fotoDireito.png";
import fundoForm from "../assets/imagem/fotoMelhoradaGestCare.png";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

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
      // SALVA O FLUXO DA VERIFICAÇÃO
      localStorage.setItem("fluxoVerificacao", "cadastro");
      navigate("/Cadastro/Verificacao");
    }
  }

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row relative overflow-x-hidden lg:overflow-hidden">
      {/* LOGO */}
      <div className="flex w-20 h-20 absolute m-7 z-10">
        <Logo img="src/assets/logos/logo_rosa.png" alt="Logo" />
      </div>

      {/* LADO ESQUERDO */}
      <div
        className="hidden lg:flex lg:w-3/5 lg:h-screen bg-cover bg-left"
        style={{ backgroundImage: `url("${fundo}")` }}
      />

      {/* LADO DIREITO */}
      <main
        className="w-full lg:w-2/5 min-h-screen lg:h-screen flex flex-col items-center justify-start pt-24 lg:pt-10 pb-8 px-6 sm:px-8 bg-cover lg:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ backgroundImage: `url("${fundoForm}")` }}
      >
        <form
          className="w-full max-w-md flex flex-col gap-3 items-center"
          onSubmit={handleSubmit}
        >
          <h2 className="font-playfair text-center text-3xl lg:text-4xl font-bold text-white">
            Crie sua conta
          </h2>

          <p className="font-playfair text-white text-center font-bold text-lg [@media(max-height:760px)]:hidden">
            Leva menos de um minuto
          </p>

          <InputCadastro ref={cadastroRef} />

          <Botao
            className="font-poppins text-center bg-teal-500 hover:bg-teal-600 font-bold text-white rounded-lg py-3 px-4 w-full transition duration-300 cursor-pointer"
            tipoDado="submit"
            nome={enviando ? "Cadastrando..." : "Cadastrar"}
          />

          <div className="text-center font-poppins w-full flex justify-center items-center gap-2 text-[16px]">
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