import Labels from "./Labels";
import Inputs from "./Inputs";
import Botao from "../components/Botao";
import { MdEmail, MdCalendarMonth } from "react-icons/md";
import { FaLock, FaEyeSlash, FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { IoEyeSharp } from "react-icons/io5";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { testarSenha } from "../utils/verificarSenha";

const URL_CADASTRO = "http://localhost:3000/api/auth/cadastrar-se";

// Classes reutilizáveis
const CAMPO = "relative w-full";
const ICONE =
  "absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 text-lg pointer-events-none";
const BOTAO_OLHO =
  "cursor-pointer text-teal-500 absolute right-3 top-1/2 -translate-y-1/2 text-lg";
const INPUT =
  "border-2 p-3 rounded-lg bg-white border-red-300 w-full outline-none focus:border-red-400 text-start text-gray-700";
const LABEL =
  "text-white font-poppins font-bold flex justify-start items-center mb-1 pl-1";

const InputCadastro = forwardRef((props, ref) => {
  const [isSenha, setIsSenha] = useState(false);
  const [isConfirmarSenha, setIsConfirmarSenha] = useState(false);
  const [senhaFocada, setSenhaFocada] = useState(false);
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

  const erroSenha = senha ? testarSenha(senha) || "" : "";

  const erroConfirmar =
    ConfirmarSenha && ConfirmarSenha !== senha ? "As senhas não coincidem" : "";

  // DICAS DE SENHA (ajuste para bater com as regras do testarSenha)
  const dicasSenha = [
    { ok: senha.length >= 8, texto: "Mínimo de 8 caracteres" },
    { ok: /[A-Z]/.test(senha), texto: "Uma letra maiúscula" },
    { ok: /[a-z]/.test(senha), texto: "Uma letra minúscula" },
    { ok: /\d/.test(senha), texto: "Um número" },
    { ok: /[^A-Za-z0-9]/.test(senha), texto: "Um caractere especial (!@#$...)" },
  ];
  const todasDicasOk = dicasSenha.every((d) => d.ok);
  const mostrarDicas = senhaFocada || senha.length > 0;

  useEffect(() => {
    if (erroCadastro) {
      erroRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
      setErroCadastro("Preencha o campo senha");
      return false;
    }
    if (erroSenha) {
      setErroCadastro("Senha inválida");
      return false;
    }
    if (!ConfirmarSenha || ConfirmarSenha !== senha) {
      setErroCadastro("As senhas não coincidem");
      return false;
    }
    if (tipoUsuario === "gestante" && !mes) {
      setErroCadastro("Informe o mês da última menstruação");
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
        meta_glicemia_jejum: metaJejum ? Number(metaJejum) : null,
        meta_glicemia_pos: metaPosPrandial ? Number(metaPosPrandial) : null,
      }),
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(URL_CADASTRO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dados }),
        signal: controller.signal,
      });

      const corpo = await response.json().catch(() => null);
      console.log("Resposta do cadastro:", corpo);

      if (!response.ok) {
        setErroCadastro(corpo?.erro || "Erro no servidor");
        return false;
      }

      localStorage.setItem("emailVerificacao", email.trim());
      setErroCadastro("");
      return true;
    } catch (error) {
      console.log(error);
      if (error.name === "AbortError") {
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

  useImperativeHandle(ref, () => ({ validar, enviar }));

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-3">
      {/* TIPO DE USUÁRIO */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-lg">
        <label className="flex items-center gap-2 cursor-pointer text-white font-poppins font-bold">
          Gestante
          <input
            type="radio"
            name="tipoUsuario"
            className="accent-pink-500"
            checked={tipoUsuario === "gestante"}
            onChange={() => setTipoUsuario("gestante")}
          />
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-white font-poppins font-bold">
          Acompanhante
          <input
            type="radio"
            name="tipoUsuario"
            className="accent-pink-500"
            checked={tipoUsuario === "acompanhante"}
            onChange={() => setTipoUsuario("acompanhante")}
          />
        </label>
      </div>

      {erroCadastro && (
        <p
          ref={erroRef}
          role="alert"
          className="text-white text-center font-bold w-full text-sm sm:text-[15px] font-playfair"
        >
          {erroCadastro}
        </p>
      )}

      {/* NOME */}
      <div className="w-full flex flex-col">
        <Labels desc="Nome" className={LABEL} />
        <div className={CAMPO}>
          <Inputs
            tipoDado="text"
            placeName="seu nome aqui"
            icone={<VscAccount className={ICONE} />}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={`${INPUT} pl-10`}
          />
        </div>
      </div>

      {/* EMAIL */}
      <div className="w-full flex flex-col">
        <Labels desc="Email" className={LABEL} />
        <div className={CAMPO}>
          <Inputs
            tipoDado="email"
            placeName="seu email aqui"
            icone={<MdEmail className={ICONE} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${INPUT} pl-10`}
          />
        </div>
      </div>

      {/* SENHA */}
      <div
        className="w-full flex flex-col"
        onFocus={() => setSenhaFocada(true)}
        onBlur={() => setSenhaFocada(false)}
      >
        <Labels desc="Senha" className={LABEL} />
        <div className={CAMPO}>
          <Inputs
            tipoDado={isSenha ? "text" : "password"}
            placeName="Crie sua senha aqui"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            icone={<FaLock className={ICONE} />}
            icone2={
              <Botao
                nome={isSenha ? <IoEyeSharp /> : <FaEyeSlash />}
                className={BOTAO_OLHO}
                clickHandler={() => setIsSenha(!isSenha)}
                tipoDado="button"
              />
            }
            className={`${INPUT} pl-10 pr-10`}
          />
        </div>

        {mostrarDicas && (
          <ul
            className="mt-2 w-full rounded-lg bg-black/18 px-3 py-2 text-white text-xs sm:text-sm font-poppins flex flex-col gap-1"
            aria-live="polite"
          >
            <li className="font-bold mb-0.5">Sua senha precisa ter:</li>
            {dicasSenha.map((d) => (
              <li
                key={d.texto}
                className={`flex items-center gap-2 transition-colors ${
                  d.ok ? "text-emerald-300" : "text-white/90"
                }`}
              >
                {d.ok ? (
                  <FaCheckCircle className="shrink-0" />
                ) : (
                  <FaRegCircle className="shrink-0" />
                )}
                {d.texto}
              </li>
            ))}
          </ul>
        )}

        {todasDicasOk && erroSenha && (
          <p className="text-white text-sm mt-1 text-center font-bold w-full">
            {erroSenha}
          </p>
        )}
      </div>

      {/* CONFIRMAR SENHA */}
      <div className="w-full flex flex-col">
        <Labels desc="Confirme sua senha" className={LABEL} />
        <div className={CAMPO}>
          <Inputs
            tipoDado={isConfirmarSenha ? "text" : "password"}
            placeName="Confirme sua senha aqui"
            value={ConfirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            icone={<FaLock className={ICONE} />}
            icone2={
              <Botao
                nome={isConfirmarSenha ? <IoEyeSharp /> : <FaEyeSlash />}
                className={BOTAO_OLHO}
                clickHandler={() => setIsConfirmarSenha(!isConfirmarSenha)}
                tipoDado="button"
              />
            }
            className={`${INPUT} pl-10 pr-10`}
          />
        </div>

        {erroConfirmar && (
          <p className="text-white text-sm mt-1 text-center font-bold w-full">
            {erroConfirmar}
          </p>
        )}
      </div>

      {/* CAMPOS DA GESTANTE */}
      {tipoUsuario === "gestante" && (
        <>
          <div className="w-full flex flex-col">
            <Labels desc="Mês da última menstruação" className={LABEL} />
            <div className={CAMPO}>
              <Inputs
                tipoDado="month"
                max={new Date().toISOString().slice(0, 7)}
                icone={<MdCalendarMonth className={ICONE} />}
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className={`${INPUT} pl-10 text-gray-500 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
              />
            </div>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <Labels
                desc="Meta jejum (mg/dl)"
                className="font-poppins font-bold text-white mb-1 pl-1"
              />
              <Inputs
                tipoDado="number"
                placeName="95"
                value={metaJejum}
                onChange={(e) => setMetaJejum(e.target.value)}
                className={INPUT}
              />
            </div>

            <div className="flex flex-col">
              <Labels
                desc="Meta pós-prandial"
                className="font-poppins font-bold text-white mb-1 pl-1"
              />
              <Inputs
                tipoDado="number"
                placeName="140"
                value={metaPosPrandial}
                onChange={(e) => setMetaPosPrandial(e.target.value)}
                className={INPUT}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default InputCadastro;