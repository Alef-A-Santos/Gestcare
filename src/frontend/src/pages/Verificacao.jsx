
import { useRef, useState } from "react";

import InputEmail from "../components/InputEmail";

import Logo from "../Components/Logo";

import logoRosa from "../assets/logos/logo_rosa.png";

import Botao from "../components/Botao";

import fundo from "../assets/imagem/fundo3.png";

import fundoForm from "../assets/imagem/fotoMelhoradaGestcare.png";

import { useNavigate } from "react-router-dom";


const URL_VERIFICAR_CODIGO =
  "http://localhost:3000/api/auth/validar-codigo";

const URL_REENVIAR_CODIGO =
  "http://localhost:3000/api/auth/reenviar-codigo";


function Verificacao() {

  const [codigo, setCodigo] = useState([
    "",
    "",
    "",
    "",
    "",
    ""
  ]);

  const [erro, setErro] = useState("");

  const [validando, setValidando] =
    useState(false);

  const [reenviando, setReenviando] =
    useState(false);

  const [mensagemReenvio, setMensagemReenvio] =
    useState("");


  const inputsRef = useRef([]);

  const navegar = useNavigate();


  function handleChange(index, valor) {

    setErro("");

    setMensagemReenvio("");

    const novoCodigo = [...codigo];

    novoCodigo[index] = valor;

    setCodigo(novoCodigo);


    // AVANÇA AUTOMATICAMENTE

    if (
      valor !== "" &&
      index < codigo.length - 1
    ) {

      inputsRef.current[index + 1]?.focus();

    }

  }


  function handleKeyDown(index, e) {

    // BACKSPACE → VOLTA PARA O CAMPO ANTERIOR

    if (
      e.key === "Backspace" &&
      codigo[index] === "" &&
      index > 0
    ) {

      inputsRef.current[index - 1]?.focus();

    }

  }


  async function reenviarCodigo(e) {

    e.preventDefault();

    setErro("");

    setMensagemReenvio("");


    // PEGA O E-MAIL SALVO

    const email =
      localStorage.getItem(
        "emailVerificacao"
      );


    if (!email) {

      setErro(
        "E-mail não encontrado. Solicite a recuperação novamente."
      );

      return;

    }


    if (reenviando) {
      return;
    }


    const controller =
      new AbortController();


    // TEMPO MÁXIMO DE 30 SEGUNDOS

    const timeout =
      setTimeout(
        () => controller.abort(),
        30000
      );


    try {

      setReenviando(true);


      const resposta =
        await fetch(
          URL_REENVIAR_CODIGO,
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              dados: {

                email: email,

              },

            }),

            signal: controller.signal,

          }
        );


      const corpo =
        await resposta
          .json()
          .catch(() => null);


      console.log(
        "Resposta ao reenviar código:",
        corpo
      );


      if (!resposta.ok) {

        setErro(

          corpo?.erro ||

          corpo?.message ||

          corpo?.mensagem ||

          "Não foi possível reenviar o código."

        );

        return;

      }


      // LIMPA OS CAMPOS DO CÓDIGO

      setCodigo([
        "",
        "",
        "",
        "",
        "",
        ""
      ]);


      setMensagemReenvio(
        "Código reenviado com sucesso! Verifique seu e-mail."
      );


      // VOLTA O FOCO PARA O PRIMEIRO CAMPO

      setTimeout(() => {

        inputsRef.current[0]?.focus();

      }, 100);


    } catch (error) {

      console.error(error);


      if (
        error.name ===
        "AbortError"
      ) {

        setErro(
          "O servidor demorou demais para responder. Tente novamente."
        );

      } else {

        setErro(
          "Não foi possível conectar ao servidor. Tente novamente mais tarde."
        );

      }

    } finally {

      clearTimeout(timeout);

      setReenviando(false);

    }

  }


  async function handleSubmit(e) {

    e.preventDefault();

    setErro("");

    setMensagemReenvio("");


    // JUNTA OS 6 CAMPOS

    const codigoString =
      codigo.join("");


    // PEGA O E-MAIL SALVO

    const email =
      localStorage.getItem(
        "emailVerificacao"
      );


    // PEGA O FLUXO DA VERIFICAÇÃO

    const fluxo =
      localStorage.getItem(
        "fluxoVerificacao"
      );


    console.log(
      "Código:",
      codigoString
    );

    console.log(
      "Tipo:",
      typeof codigoString
    );

    console.log(
      "E-mail:",
      email
    );

    console.log(
      "Fluxo:",
      fluxo
    );


    // VERIFICA SE EXISTE E-MAIL

    if (!email) {

      setErro(
        "E-mail não encontrado. Solicite um novo código."
      );

      return;

    }


    // VERIFICA SE EXISTE FLUXO

    if (!fluxo) {

      setErro(
        "Não foi possível identificar a origem da verificação."
      );

      return;

    }


    // VERIFICA SE O CÓDIGO ESTÁ COMPLETO

    if (
      codigoString.length !== 6
    ) {

      setErro(
        "Preencha o código completo."
      );

      return;

    }


    // VERIFICA SE É SOMENTE NÚMERO

    if (
      !/^\d{6}$/.test(codigoString)
    ) {

      setErro(
        "O código deve conter somente números."
      );

      return;

    }


    try {

      setValidando(true);


      const resposta =
        await fetch(
          URL_VERIFICAR_CODIGO,
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              codigo: codigoString,

              dados: {

                email: email,

              },

            }),

          }
        );


      const corpo =
        await resposta
          .json()
          .catch(() => null);


      console.log(
        "Resposta do backend:",
        corpo
      );


      // BACKEND RETORNOU ERRO

      if (!resposta.ok) {

        setErro(

          corpo?.erro ||

          corpo?.message ||

          corpo?.mensagem ||

          "Código inválido. Tente novamente."

        );

        return;

      }


      // CÓDIGO CORRETO

      console.log(
        "Código validado com sucesso."
      );


      // GUARDA O CÓDIGO

      localStorage.setItem(
        "codigoVerificacao",
        codigoString
      );


      // FLUXO DE CADASTRO

      if (
        fluxo === "cadastro"
      ) {

        navegar("/home");

        return;

      }


      // FLUXO DE REDEFINIÇÃO DE SENHA

      if (
        fluxo === "redefinicao"
      ) {

        navegar(
          "/redefinirSenha"
        );

        return;

      }


      // FLUXO INVÁLIDO

      setErro(
        "Fluxo de verificação inválido."
      );


    } catch (error) {

      console.error(error);


      setErro(
        "Não foi possível conectar ao servidor. Tente novamente."
      );


    } finally {

      setValidando(false);

    }

  }


  return (

    <div className="min-h-screen w-full overflow-x-hidden">

      <div className="min-h-screen w-full flex flex-col lg:flex-row">


        {/* LOGO */}

        <div className="m-5 sm:m-7 flex w-25 absolute z-10">

          <Logo
            img={logoRosa}
          />

        </div>


        {/* LADO ESQUERDO */}

        <div

          className="hidden lg:flex lg:w-3/5 min-h-screen p-8 text-white bg-cover bg-left"

          style={{
            backgroundImage:
              `url("${fundo}")`
          }}

        >

        </div>


        {/* LADO DIREITO */}

        <main

          className="w-full lg:w-2/5 min-h-screen flex items-center justify-center px-6 rounded-lg overflow-hidden bg-no-repeat md:h-screen"

          style={{
            backgroundImage:
              `url("${fundoForm}")`
          }}

        >

          <div className="w-full max-w-145 min-h-screen flex flex-col justify-center gap-5 py-20">


            <h2 className="font-playfair text-center text-4xl md:text-[55px] text-white mt-8 md:mb-7">

              <b>
                Estamos quase lá...
              </b>

            </h2>


            <h2 className="font-poppins text-center text-2xl md:text-[21px] text-white mt-1 px-2 w-full md:mb-5">

              <b>
                Insira o código que foi enviado em seu Email
              </b>

            </h2>


            <form
              onSubmit={handleSubmit}
            >

              <div className="w-full flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 p-2">

                {codigo.map(
                  (valor, index) => (

                    <InputEmail

                      key={index}

                      ref={(elemento) => {

                        inputsRef.current[index] =
                          elemento;

                      }}

                      valor={valor}

                      onChange={(valor) =>
                        handleChange(
                          index,
                          valor
                        )
                      }

                      onKeyDown={(e) =>
                        handleKeyDown(
                          index,
                          e
                        )
                      }

                    />

                  )
                )}

              </div>


              {/* MENSAGEM DE SUCESSO */}

              {mensagemReenvio && (

                <p

                  role="status"

                  className="text-white text-center font-bold text-sm mt-3 font-poppins px-2"

                >

                  {mensagemReenvio}

                </p>

              )}


              {/* MENSAGEM DE ERRO */}

              {erro && (

                <p

                  role="alert"

                  className="text-white text-center font-bold text-sm mt-3 font-playfair px-2"

                >

                  {erro}

                </p>

              )}


              <Botao

                type="submit"

                disabled={
                  validando ||
                  reenviando
                }

                className="text-center bg-teal-500 hover:bg-teal-600 font-bold text-white rounded-lg py-3 m-2 w-full max-w-100 cursor-pointer font-poppins disabled:opacity-70 disabled:cursor-not-allowed"

                nome={

                  validando

                    ? "Validando código..."

                    : "Validar código"

                }

              />

            </form>


            <div className="text-center font-poppins text-white text-sm sm:text-[16px] px-2">

              <p>

                Não recebeu o código?{" "}

                <a

                  href="#"

                  onClick={reenviarCodigo}

                  className={`underline text-white font-bold ${
                    reenviando
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}

                >

                  {reenviando
                    ? "Reenviando..."
                    : "Reenviar Código"}

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
