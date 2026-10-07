
import Logo from "../Components/Logo";

import fundo from "../assets/imagem/fundoredefinir.png";

import fundoForm from "../assets/imagem/fotoMelhoradaGestcare.png";

import { Link, useNavigate } from "react-router-dom";

import logoRosa from "../assets/logos/logo_rosa.png";

import Labels from "../components/Labels";

import Inputs from "../components/Inputs";

import { FaLock } from "react-icons/fa";

import { FaEyeSlash } from "react-icons/fa";

import { IoEyeSharp } from "react-icons/io5";

import { useState } from "react";

import Botao from "../components/Botao";

import { testarSenha } from "../utils/verificarSenha";


const URL_ALTERAR_SENHA =
  "http://localhost:3000/api/auth/alterar-senha";


function RedefinirSenha() {

  const navigate = useNavigate();

  const [isSenha, setIsSenha] = useState(false);

  const [isConfirmarSenha, setIsConfirmarSenha] =
    useState(false);

  const [senha, setSenha] = useState("");

  const [ConfirmarSenha, setConfirmarSenha] =
    useState("");

  const [erroCadastro, setErroCadastro] =
    useState("");

  const [carregando, setCarregando] =
    useState(false);


  const erroSenha =
    senha ? testarSenha(senha) || "" : "";

  const erroConfirmar =
    ConfirmarSenha &&
    ConfirmarSenha !== senha
      ? "As senhas não coincidem"
      : "";


  async function validar() {

    setErroCadastro("");


    if (!senha) {

      setErroCadastro(
        "Preencha o campo senha"
      );

      return;

    }


    if (erroSenha) {

      setErroCadastro(
        "Senha inválida"
      );

      return;

    }


    if (
      !ConfirmarSenha ||
      ConfirmarSenha !== senha
    ) {

      setErroCadastro(
        "As senhas não coincidem"
      );

      return;

    }


    // PEGA O EMAIL SALVO DURANTE A RECUPERAÇÃO
    const email =
      localStorage.getItem(
        "emailVerificacao"
      );


    if (!email) {

      setErroCadastro(
        "E-mail não encontrado. Solicite a recuperação de senha novamente."
      );

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

      setCarregando(true);


      const resposta =
        await fetch(
          URL_ALTERAR_SENHA,
          {

            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              dados: {

                email: email,

                senha: senha,

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
        "Resposta ao alterar senha:",
        corpo
      );


      if (!resposta.ok) {

        setErroCadastro(

          corpo?.erro ||

          corpo?.message ||

          corpo?.mensagem ||

          "Não foi possível alterar a senha."

        );

        return;

      }


      console.log(
        "Senha alterada com sucesso!"
      );


      // LIMPA DADOS DA VERIFICAÇÃO
      localStorage.removeItem(
        "codigoVerificacao"
      );

      localStorage.removeItem(
        "fluxoVerificacao"
      );

      localStorage.removeItem(
        "emailVerificacao"
      );


      // VOLTA PARA O LOGIN
      navigate("/login");


    } catch (error) {

      console.error(error);


      if (
        error.name ===
        "AbortError"
      ) {

        setErroCadastro(
          "O servidor demorou demais para responder. Tente novamente."
        );

      } else {

        setErroCadastro(
          "Não foi possível conectar ao servidor. Tente novamente mais tarde."
        );

      }

    } finally {

      clearTimeout(timeout);

      setCarregando(false);

    }

  }


  return (

    <div>

      <div className="min-h-screen flex flex-col md:flex-row">

        <div className="m-7 flex w-25 absolute">

          <Logo img={logoRosa} />

        </div>


        {/* LADO ESQUERDO */}

        <div

          className="w-full md:w-AUTO h-screen p-8 text-white bg-cover bg-left hidden lg:flex"

          style={{
            backgroundImage:
              `url("${fundo}")`
          }}

        >

        </div>


        {/* LADO DIREITO */}

        <main

          className="w-full md:w-2/5 min-h-screen flex items-center justify-center px-6 rounded-lg"

          style={{
            backgroundImage:
              `url("${fundoForm}")`
          }}

        >

          <div className="w-full h-full flex flex-col justify-center gap-5">


            <h2 className="font-playfair text-center text-4xl text-white mt-12">

              <b>
                Redefinir senha.
              </b>

            </h2>


            <p className="font-poppins text-center text-[20px] text-white font-bold m-3">

              Crie sua nova senha

            </p>


            {/* SENHA */}

            <div className="w-96 flex flex-col justify-center lg:justify-start items-center relative mx-auto">

              <Labels

                desc="Senha"

                className="text-white font-poppins font-bold sm:text-center flex justify-start items-center m-1 pl-2"

              />


              <Inputs

                tipoDado={
                  isSenha
                    ? "text"
                    : "password"
                }

                placeName="Crie sua senha aqui"

                value={senha}

                onChange={(e) =>
                  setSenha(
                    e.target.value
                  )
                }

                icone={

                  <FaLock className="absolute text-teal-500 m-5" />

                }

                icone2={

                  <Botao

                    nome={
                      isSenha
                        ? <IoEyeSharp />
                        : <FaEyeSlash />
                    }

                    className="cursor-pointer text-teal-500 absolute right-10 top-2/4 -translate-y-6/10 m-1"

                    clickHandler={() =>
                      setIsSenha(
                        !isSenha
                      )
                    }

                    tipoDado="button"

                  />

                }

                className="border-2 p-3 text-start rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-grey-300 pl-11 pr-6"

              />


              {erroSenha && (

                <p className="text-white text-sm mt-1 text-center font-bold w-full">

                  {erroSenha}

                </p>

              )}

            </div>


            {/* CONFIRMAR SENHA */}

            <div className="w-96 flex flex-col justify-center lg:justify-start items-center relative mx-auto">

              <Labels

                desc="Confirme sua senha"

                className="text-white font-poppins font-bold sm:text-center flex justify-start items-center m-1 pl-2"

              />


              <Inputs

                tipoDado={
                  isConfirmarSenha
                    ? "text"
                    : "password"
                }

                placeName="Confirme sua senha aqui"

                value={
                  ConfirmarSenha
                }

                onChange={(e) =>
                  setConfirmarSenha(
                    e.target.value
                  )
                }

                icone={

                  <FaLock className="absolute text-teal-500 m-5" />

                }

                icone2={

                  <Botao

                    nome={

                      isConfirmarSenha
                        ? <IoEyeSharp />
                        : <FaEyeSlash />

                    }

                    className="cursor-pointer text-teal-500 absolute right-10 top-2/4 -translate-y-6/10 m-1"

                    clickHandler={() =>
                      setIsConfirmarSenha(
                        !isConfirmarSenha
                      )
                    }

                    tipoDado="button"

                  />

                }

                className="border-2 p-3 text-start rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-grey-300 pl-11 pr-6"

              />


              {erroConfirmar && (

                <p className="text-white text-sm mt-1 text-center font-bold w-full">

                  {erroConfirmar}

                </p>

              )}

            </div>


            {/* ERRO GERAL */}

            {erroCadastro && (

              <p className="text-white text-center font-bold font-playfair">

                {erroCadastro}

              </p>

            )}


            {/* BOTÃO */}

            <div className="flex justify-center">

              <Botao

                nome={
                  carregando
                    ? "Redefinindo..."
                    : "Redefinir senha"
                }

                tipoDado="button"

                clickHandler={validar}

                disabled={carregando}

                className="bg-teal-500 text-white font-poppins font-bold py-3 px-8 rounded-lg cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"

              />

            </div>


            <div className="text-center font-poppins text-white text-[16px]">

              <Link

                className="hover:underline text-white font-bold"

                to="/login"

              >

                Voltar ao login

              </Link>

            </div>


          </div>

        </main>

      </div>

    </div>

  );

}


export default RedefinirSenha;

