
import Labels from "./Labels";

import Inputs from "./Inputs";

import { MdEmail } from "react-icons/md";

import { FaLock } from "react-icons/fa";

import { MdCalendarMonth } from "react-icons/md";

import { VscAccount } from "react-icons/vsc";

import { useEffect, useRef, useState } from "react";

import Botao from "../components/Botao";

import { FaEyeSlash } from "react-icons/fa";

import { IoEyeSharp } from "react-icons/io5";

import { testarSenha } from "../utils/verificarSenha";

import { forwardRef, useImperativeHandle } from "react";


const URL_CADASTRO =
  "http://localhost:3000/api/auth/cadastrar-se";


const InputCadastro = forwardRef((props, ref) => {

  const [isSenha, setIsSenha] = useState(false);

  const [isConfirmarSenha, setIsConfirmarSenha] = useState(false);

  const [tipoUsuario, setTipoUsuario] = useState("gestante");

  const [nome, setNome] = useState("");

  const [email, setEmail] = useState("");

  const [senha, setSenha] = useState("");

  const [ConfirmarSenha, setConfirmarSenha] = useState("");

  const [mes, setMes] = useState("");

  const [metaJejum, setMetaJejum] = useState("");

  const [metaPosPrandial, setMetaPosPrandial] = useState("");

  const [erroCadastro, setErroCadastro] = useState("");

  const erroRef = useRef(null);


  const erroSenha =
    senha ? testarSenha(senha) || "" : "";


  const erroConfirmar =
    ConfirmarSenha &&
    ConfirmarSenha !== senha
      ? "As senhas não coincidem"
      : "";


  useEffect(() => {

    if (erroCadastro) {

      erroRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }

  }, [erroCadastro]);


  function validar() {

    if (!nome.trim()) {

      setErroCadastro("Preencha o nome");

      return false;

    }


    if (!email.trim()) {

      setErroCadastro("Preencha o email");

      return false;

    }


    if (!senha) {

      setErroCadastro(
        "Preencha o campo senha"
      );

      return false;

    }


    if (erroSenha) {

      setErroCadastro(
        "Senha inválida"
      );

      return false;

    }


    if (
      !ConfirmarSenha ||
      ConfirmarSenha !== senha
    ) {

      setErroCadastro(
        "As senhas não coincidem"
      );

      return false;

    }


    if (
      tipoUsuario === "gestante" &&
      !mes
    ) {

      setErroCadastro(
        "Informe o mês da última menstruação"
      );

      return false;

    }


    setErroCadastro("");

    return true;

  }


  async function enviar() {

    const dados = {

      nome,

      email,

      senha,

      perfil: tipoUsuario,

      ...(tipoUsuario === "gestante" && {

        mes,

        metaJejum: metaJejum
          ? Number(metaJejum)
          : null,

        metaPosPrandial:
          metaPosPrandial
            ? Number(metaPosPrandial)
            : null,

      }),

    };


    const controller =
      new AbortController();


    // 10 segundos para o backend responder

    const timeout = setTimeout(
      () => controller.abort(),
      10000
    );


    try {

      const response = await fetch(
        URL_CADASTRO,
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            dados
          }),

          signal: controller.signal,

        }
      );


      const corpo =
        await response
          .json()
          .catch(() => null);


      console.log(
        "Resposta do cadastro:",
        corpo
      );


      if (!response.ok) {

        setErroCadastro(
          corpo?.erro ||
          "Erro no servidor"
        );

        return false;

      }


      // SALVA O E-MAIL PARA A VERIFICAÇÃO

      localStorage.setItem(
        "emailVerificacao",
        email.trim()
      );


      console.log(
        "E-mail salvo no LocalStorage:",
        localStorage.getItem(
          "emailVerificacao"
        )
      );


      setErroCadastro("");

      return true;


    } catch (error) {

      console.log(error);


      if (
        error.name === "AbortError"
      ) {

        setErroCadastro(
          "O servidor demorou demais para responder. Tente novamente."
        );

      } else {

        setErroCadastro(
          "Não foi possível conectar ao servidor, tente novamente ou mais tarde."
        );

      }


      return false;


    } finally {

      clearTimeout(timeout);

    }

  }


  useImperativeHandle(
    ref,
    () => ({
      validar,
      enviar
    })
  );


  return (

    <div className="flex justify-center items-center flex-col gap-1 overflow-y-hidden">


      <div className="flex text-[20px] gap-3">


        <div className="flex">

          <label className="text-white font-poppins font-bold flex justify-start items-center mr-3 pl-2">

            Gestante

          </label>


          <input

            type="radio"

            name="tipoUsuario"

            className="accent-pink-500"

            checked={
              tipoUsuario === "gestante"
            }

            onChange={() =>
              setTipoUsuario("gestante")
            }

          />

        </div>


        <div className="flex">

          <label className="text-white font-poppins font-bold flex justify-start items-center m-1 pl-2 mr-3">

            Acompanhante

          </label>


          <input

            type="radio"

            name="tipoUsuario"

            className="accent-pink-500"

            checked={
              tipoUsuario === "acompanhante"
            }

            onChange={() =>
              setTipoUsuario("acompanhante")
            }

          />

        </div>


      </div>


      {erroCadastro && (

        <p

          ref={erroRef}

          role="alert"

          className="text-white mb-1 mt-1 text-center font-bold w-full sm:text-[15px] font-playfair"

        >

          {erroCadastro}

        </p>

      )}


      <div className="w-100 flex flex-col justify-center items-center">

        <Labels

          desc="Nome"

          className="text-white font-poppins font-bold flex justify-start items-center m-1 pl-2"

        />


        <Inputs

          tipoDado="text"

          placeName="seu nome aqui"

          icone={
            <VscAccount className="absolute text-teal-500 m-4" />
          }

          value={nome}

          onChange={(e) =>
            setNome(e.target.value)
          }

          className="border-2 p-3 rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-start text-grey-300 pl-9"

        />

      </div>


      <div className="w-96 flex flex-col justify-center lg:justify-start items-center">

        <Labels

          desc="Email"

          className="text-white font-poppins font-bold flex justify-start items-center m-1 pl-2"

        />


        <Inputs

          tipoDado="email"

          placeName="seu email aqui"

          value={email}

          onChange={(e) =>
            setEmail(e.target.value)
          }

          icone={
            <MdEmail className="absolute text-teal-500 m-4" />
          }

          className="border-2 p-3 rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-start text-grey-300 pl-9"

        />

      </div>


      <div className="w-96 flex flex-col justify-center lg:justify-start items-center relative">

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
            setSenha(e.target.value)
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
                setIsSenha(!isSenha)
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


      <div className="w-96 flex flex-col justify-center lg:justify-start items-center relative">

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

          value={ConfirmarSenha}

          onChange={(e) =>
            setConfirmarSenha(e.target.value)
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

          className="border-2 p-3 text-start rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-grey-300 pl-11 pr-15"

        />


        {erroConfirmar && (

          <p className="text-white text-sm mt-1 text-center font-bold w-full">

            {erroConfirmar}

          </p>

        )}

      </div>


      {tipoUsuario === "gestante" && (

        <div className="flex flex-col justify-center items-center">


          <div className="w-96 flex flex-col justify-center lg:justify-start items-center">

            <Labels

              desc="Mês da última menstruação"

              className="text-white font-poppins font-bold m-1 flex justify-start items-center pl-2 mb-1"

            />


            <Inputs

              tipoDado="month"

              icone={

                <MdCalendarMonth className="absolute text-teal-500 m-4 text-end" />

              }

              value={mes}

              onChange={(e) =>
                setMes(e.target.value)
              }

              className="border-2 p-3 text-start rounded-lg bg-white border-red-300 w-full sm:w-96 outline-none focus:border-red-400 focus:border-2 text-gray-500 pl-9 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"

            />

          </div>


          <div className="flex flex-col sm:flex-row gap-3 sm:gap-1 m-2 text-start">


            <div className="flex flex-col text-center p-1">

              <Labels

                desc="Meta jejum (mg/dl)"

                className="font-poppins font-bold text-center text-white"

              />


              <Inputs

                tipoDado="number"

                placeName="95"

                value={metaJejum}

                onChange={(e) =>
                  setMetaJejum(e.target.value)
                }

                className="border-2 p-3 rounded-lg bg-white border-red-300 w-full sm:w-50 outline-none focus:border-red-400 focus:border-2 text-start mt-2 text-grey-300"

              />

            </div>


            <div className="flex flex-col text-center p-1">

              <Labels

                desc="Meta pós-prandial"

                className="font-poppins font-bold text-center text-white"

              />


              <Inputs

                tipoDado="number"

                placeName="140"

                value={metaPosPrandial}

                onChange={(e) =>
                  setMetaPosPrandial(e.target.value)
                }

                className="border-2 p-3 rounded-lg bg-white border-red-300 w-full sm:w-50 outline-none focus:border-red-400 focus:border-2 md:text-start mt-2 text-grey-300 sm:text-center"

              />

            </div>


          </div>

        </div>

      )}

    </div>

  );

});


export default InputCadastro;
