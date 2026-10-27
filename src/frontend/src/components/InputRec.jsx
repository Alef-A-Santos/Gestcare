
import { MdEmail } from "react-icons/md";
import Botao from "./Botao";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const URL_ESQUECI_SENHA =
  "http://localhost:3000/api/auth/reenviar-codigo";

function InputRec() {
  const navegar = useNavigate();

  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro("");

    if (!email.trim()) {
      return;
    }

    // SALVA O E-MAIL NO LOCALSTORAGE
    localStorage.setItem(
      "emailVerificacao",
      email.trim()
    );

    // DEFINE QUE A VERIFICAÇÃO É PARA REDEFINIÇÃO DE SENHA
    localStorage.setItem(
      "fluxoVerificacao",
      "redefinicao"
    );

    console.log(
      "E-mail salvo no LocalStorage:",
      localStorage.getItem("emailVerificacao")
    );

    const controller = new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      10000
    );

    try {
      setCarregando(true);

      const resposta = await fetch(
        URL_ESQUECI_SENHA,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dados: {
              email: email.trim(),
            },
          }),
          signal: controller.signal,
        }
      );

      const corpo = await resposta
        .json()
        .catch(() => null);

      console.log(
        "Resposta do backend:",
        corpo
      );

      if (!resposta.ok) {
        setErro(
          corpo?.erro ||
          corpo?.message ||
          corpo?.mensagem ||
          "Erro no servidor"
        );
        return;
      }

      // ENVIO REALIZADO COM SUCESSO
      navegar("/recSenha/Verificacao");

    } catch (error) {
      console.error(error);

      setErro(
        error.name === "AbortError"
          ? "O servidor demorou demais para responder. Tente novamente."
          : "Não foi possível conectar ao servidor, tente novamente mais tarde."
      );

    } finally {
      clearTimeout(timeout);
      setCarregando(false);
    }
  }

  return (
    <div className="w-full flex flex-col">
      <form
        className="flex justify-center items-center gap-1 px-4"
        onSubmit={enviar}
      >
        <div className="flex justify-center items-center flex-col">

          <label className="font-poppins text-[15px] text-white font-bold flex justify-start w-full m-2 pl-2">
            Email
          </label>

          <div className="relative lg:w-100 w-80">
            <MdEmail className="absolute left-3 top-2/4 -translate-y-1/2 text-teal-500" />

            <input
              className="border p-2 pl-10 text-center rounded-lg bg-white border-red-300 w-full outline-none focus:border-red-400 focus:border-2"
              type="email"
              placeholder="Digite seu email aqui"
              required
              name="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          {erro && (
            <p
              role="alert"
              className="text-white text-center font-bold text-sm mt-2 font-playfair"
            >
              {erro}
            </p>
          )}

          <div className="relative lg:w-100 w-80">
            <Botao
              className="text-center bg-teal-500 hover:bg-teal-600 font-bold text-white rounded-lg py-3 m-2 w-full max-w-100 cursor-pointer font-poppins mt-9"
              nome={
                carregando
                  ? "Enviando..."
                  : "Redefinir senha"
              }
              tipoDado={"submit"}
              disabled={carregando}
            />
          </div>

        </div>
      </form>
    </div>
  );
}

export default InputRec;
