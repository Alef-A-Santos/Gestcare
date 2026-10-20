import { FaLock, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import Botao from "./BotaoHome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InputHome() {
  const [isSenha, setIsSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const [dados, setdados] = useState({
    email: "",
    senha: "",
  });

  async function enviar(e) {
    e.preventDefault();

    setErro("");
    setCarregando(true);

    const controller = new AbortController();

    // Tempo máximo: 30 segundos
    const timeout = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dados }),
        signal: controller.signal,
      });

      const corpo = await response.json().catch(() => null);

      console.log("Resposta do login:", corpo);
      console.log("Dados enviados:", dados);

      if (!response.ok) {
        setErro(
          corpo?.erro ||
            corpo?.message ||
            corpo?.mensagem ||
            "Falha ao realizar login.",
        );

        return;
      }

      navigate("/Home");
    } catch (error) {
      console.log(error);

      if (error.name === "AbortError") {
        setErro("O servidor demorou demais para responder. Tente novamente.");
      } else {
        setErro(
          "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
        );
      }
    } finally {
      clearTimeout(timeout);
      setCarregando(false);
    }
  }

  function handleChange(e) {
    const nome = e.target.name;

    const dadosAtuais = {
      ...dados,
    };

    dadosAtuais[nome] = e.target.value;

    setdados(dadosAtuais);
  }

  useEffect(() => {
    console.log(dados);
  }, [dados]);

  return (
    <div className="w-full flex flex-col">
      <form
        className="flex justify-center items-center gap-1 px-4"
        onSubmit={enviar}
      >
        <div className="flex justify-center items-center flex-col">
          <label className="font-poppins Display text-[15px] text-white font-bold flex justify-start w-full m-2 pl-2">
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
              value={dados.email}
              onChange={handleChange}
              disabled={carregando}
            />
          </div>

          <label className="font-poppins text-[15px] mt-5 text-white font-bold w-full m-2 pl-2">
            Senha
          </label>

          <div className="relative lg:w-100 w-80">
            <FaLock className="absolute left-3 top-1/6 -translate-y-1/2 text-teal-500" />

            <input
              className="border p-2 pl-10 text-center rounded-lg bg-white border-red-300 w-full outline-none focus:border-red-400 focus:border-2"
              type={isSenha ? "text" : "password"}
              placeholder="Digite sua senha aqui"
              required
              name="senha"
              value={dados.senha}
              onChange={handleChange}
              disabled={carregando}
            />

            <Botao
              tipo="button"
              nome={isSenha ? <IoEyeSharp /> : <FaEyeSlash />}
              className="cursor-pointer text-teal-500 absolute right-4 top-1/6 -translate-y-1/2"
              clickHandler={() => setIsSenha(!isSenha)}
              disabled={carregando}
            />

            {erro && (
              <p
                role="alert"
                className="text-white text-center font-bold text-sm mt-3 font-poppins"
              >
                {erro}
              </p>
            )}

            <Botao
              tipo="submit"
              disabled={carregando}
              className="text-center bg-teal-500 hover:bg-teal-600 font-bold text-white rounded-lg py-3 m-2 w-full max-w-100 cursor-pointer font-poppins mt-9 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 hover:shadow-xl hover:duration-500"
              nome={carregando ? "Entrando..." : "Entrar"}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default InputHome;
