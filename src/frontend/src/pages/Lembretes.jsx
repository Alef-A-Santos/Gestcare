import { useEffect, useMemo, useState } from "react";
import {
  FaSyringe,
  FaPills,
  FaUtensils,
  FaCalendarCheck,
  FaTint,
  FaCheckCircle,
  FaPlus,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import Header from "../components/Header";
import Botao from "../components/Botao";
import { useUsuario } from "../context/UsuarioContext";


/* ---------- configuração das categorias ---------- */
const CATEGORIAS = {
  Glicemia: { icone: FaSyringe, tag: "bg-[#a8f0d8] text-[#1f9d8e]", icon: "bg-[#e0efee] text-[#1f9d8e]" },
  Medicação: { icone: FaPills, tag: "bg-[#fbcfe3] text-[#d46a9a]", icon: "bg-[#f3e6ec] text-[#b03a6a]" },
  Alimentação: { icone: FaUtensils, tag: "bg-[#a8f0d8] text-[#1f9d8e]", icon: "bg-[#e0efee] text-[#1f9d8e]" },
  Consulta: { icone: FaCalendarCheck, tag: "bg-[#a8f0d8] text-[#1f9d8e]", icon: "bg-[#e0efee] text-[#1f9d8e]" },
  Hidratação: { icone: FaTint, tag: "bg-[#fbcfe3] text-[#d46a9a]", icon: "bg-[#f3e6ec] text-[#d46a9a]" },
};

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const NOMES_DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const API = import.meta.env.VITE_BACK_URL || import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const CHAVE_PUSH = "gestcare_push_ativado";
const CATEGORIAS_API = {
  Glicemia: "glicemia",
  "Medicação": "medicao",
  Alimentação: "alimentacao",
  Consulta: "consulta",
  "Hidratação": "hidratacao",
};

// O Botao renderiza Component com text-3xl; aqui o ícone fica menor, como no protótipo
const IconeMais = () => <FaPlus size={14} />;

/* ---------- componentes pequenos ---------- */
function Toggle({ ligado, onChange, rotulo }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      onClick={onChange}
      className={`relative h-8 w-14 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f9d8e] focus-visible:ring-offset-2 ${
        ligado ? "bg-[#1f9d8e]" : "bg-[#5b7a75]"
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-[#d9d9d9] shadow transition-all duration-200 ${
          ligado ? "left-7" : "left-1"
        }`}
      />
    </button>
  );
}

function CartaoLembrete({ lembrete, onToggle, onRemover }) {
  const cat = CATEGORIAS[lembrete.categoria];
  const Icone = cat.icone;

  return (
    <li
      className={`group flex items-center gap-3 rounded-2xl border-2 bg-white px-3 py-3 transition-all duration-200 hover:shadow-md sm:gap-4 sm:px-4 ${
        lembrete.ativo ? "border-[#1f9d8e]" : "border-[#d9e6e4] opacity-80"
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg sm:h-12 sm:w-12 sm:text-xl ${cat.icon}`}>
        <Icone />
      </div>

      <div className="min-w-0 flex-1">
        <p className={`font-medium leading-snug sm:truncate ${lembrete.ativo ? "text-black" : "text-gray-500"}`}>
          {lembrete.titulo}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm text-gray-500">{lembrete.hora} - Todos os dias</p>
          <span className={`rounded-full px-3 py-0.5 text-xs font-medium sm:hidden ${cat.tag}`}>
            {lembrete.categoria}
          </span>
        </div>
      </div>

      <span className={`hidden rounded-full px-4 py-1 text-sm font-medium sm:inline-block ${cat.tag}`}>
        {lembrete.categoria}
      </span>

      <button
        type="button"
        onClick={onRemover}
        aria-label={`Excluir lembrete ${lembrete.titulo}`}
        className="cursor-pointer rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-400 focus:opacity-100 sm:text-gray-300 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <FaTrash size={14} />
      </button>

      <Toggle
        ligado={lembrete.ativo}
        onChange={onToggle}
        rotulo={`${lembrete.ativo ? "Desativar" : "Ativar"} lembrete ${lembrete.titulo}`}
      />
    </li>
  );
}

function ModalNovoLembrete({ aberto, onFechar, onSalvar }) {
  const [titulo, setTitulo] = useState("");
  const [hora, setHora] = useState("");
  const [categoria, setCategoria] = useState("Glicemia");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  function enviar(e) {
    e.preventDefault();
    if (!titulo.trim() || !hora) {
      setErro("Preencha o nome e o horário do lembrete.");
      return;
    }
    onSalvar({ titulo: titulo.trim(), hora, categoria });
    setTitulo("");
    setHora("");
    setCategoria("Glicemia");
    setErro("");
  }

  const campo =
    "w-full rounded-xl border-2 border-[#d9e6e4] bg-white px-4 py-2.5 outline-none transition focus:border-[#1f9d8e]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onFechar}
    >
      <form
        onSubmit={enviar}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="titulo-modal" className="font-playfair text-2xl font-semibold text-pink-400">
            Novo lembrete
          </h2>
          <button type="button" onClick={onFechar} aria-label="Fechar" className="cursor-pointer text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-gray-600">O que lembrar?</span>
          <input
            className={campo}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex.: Medir glicemia antes do jantar"
            autoFocus
          />
        </label>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-600">Horário</span>
            <input type="time" className={campo} value={hora} onChange={(e) => setHora(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-600">Categoria</span>
            <select className={campo} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {Object.keys(CATEGORIAS).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        {erro && <p className="mb-3 text-sm text-red-500">{erro}</p>}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Botao
            nome="Cancelar"
            tipoDado="button"
            clickHandler={onFechar}
            className="w-full cursor-pointer rounded-full px-5 py-2.5 text-gray-600 transition hover:bg-gray-100 sm:w-auto"
          />
          <Botao
            nome="Salvar"
            tipoDado="submit"
            className="w-full cursor-pointer rounded-full bg-[#ff6fae] px-6 py-2.5 font-medium text-white transition hover:bg-[#f2559b] sm:w-auto"
          />
        </div>
      </form>
    </div>
  );
}

/* ---------- página ---------- */
function Lembretes() {
  const usuario = useUsuario();
  const [lembretes, setLembretes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(() => localStorage.getItem(CHAVE_PUSH) === "true");

  async function requisitar(url, opcoes = {}) {
    const resposta = await fetch(`${API}${url}`, { credentials: "include", ...opcoes,
      headers: { "Content-Type": "application/json", ...opcoes.headers } });
    const dados = await resposta.json().catch(() => null);
    if (!resposta.ok) throw new Error(dados?.erro || dados?.mensagem || "Não foi possível concluir a operação.");
    return dados;
  }

  const normalizar = (l) => {
    const categoria = Object.keys(CATEGORIAS_API).find((nome) => CATEGORIAS_API[nome] === l.categoria) || l.categoria;
    return {
      ...l,
      id: l.id_lembrete,
      hora: String(l.horario || "").slice(0, 5),
      categoria: CATEGORIAS[categoria] ? categoria : "Glicemia",
      ativo: Number(l.ativo) === 1 || l.ativo === true,
    };
  };
  async function carregarLembretes() {
    const dados = await requisitar("/lembretes/listar-lembretes-usuario");
    setLembretes((dados?.lembretes || []).map(normalizar));
  }
  useEffect(() => {
    if (!usuario) return;
    let ativo = true;
    requisitar("/lembretes/listar-lembretes-usuario")
      .then((dados) => { if (ativo) setLembretes((dados?.lembretes || []).map(normalizar)); })
      .catch((e) => { if (ativo) setErro(e.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [usuario]);
  const ordenados = useMemo(
    () => [...lembretes].sort((a, b) => a.hora.localeCompare(b.hora)),
    [lembretes]
  );
  const totalAtivos = lembretes.filter((l) => l.ativo).length;
  const diaHoje = new Date().getDay();

  function alternar(id) {
    const lembrete = lembretes.find((l) => l.id === id);
    if (!lembrete) return;
    requisitar(`/lembretes/alterar-status-lembrete/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ status: !lembrete.ativo }) }).then(carregarLembretes).catch((e) => setErro(e.message));
  }

  function remover(id) {
    requisitar(`/lembretes/deletar-lembrete/${encodeURIComponent(id)}`, { method: "DELETE" }).then(carregarLembretes).catch((e) => setErro(e.message));
  }

  async function adicionar(novo) {
    try {
      // Garante que exista uma subscription cadastrada no backend, mesmo se o
      // estado salvo no navegador estiver desatualizado.
      await ativarNotificacoes();
      await requisitar("/lembretes/criar-lembrete", { method: "POST", credentials: "include", body: JSON.stringify({ dados: {
        titulo: novo.titulo, horario: novo.hora, categoria: CATEGORIAS_API[novo.categoria],
        recorrencia: [0, 1, 2, 3, 4, 5, 6], horario_fixo: true, periodicamente: true,
      } }) });
      await carregarLembretes(); setModalAberto(false); setErro("");
    } catch (e) { setErro(e.message); }
  }
  async function ativarNotificacoes() {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) throw new Error("Este navegador não oferece suporte a notificações push.");
      const chave = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!chave) throw new Error("Configure VITE_VAPID_PUBLIC_KEY com a chave pública VAPID do backend.");
      if (await Notification.requestPermission() !== "granted") throw new Error("Permissão para notificações não concedida.");
      const base64 = chave.replace(/-/g, "+").replace(/_/g, "/");
      const raw = atob(base64.padEnd(base64.length + ((4 - base64.length % 4) % 4), "="));
      const key = Uint8Array.from(raw, (x) => x.charCodeAt(0));
      const reg = await navigator.serviceWorker.register("/sw.js");
      const subscription = await reg.pushManager.getSubscription() || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
      try { await requisitar("/dispositivos/cadastrar-dispositivo", { method: "POST", body: JSON.stringify({ subscription: subscription.toJSON() }) }); }
      catch (e) { if (!/já cadastrado/i.test(e.message)) throw e; }
      localStorage.setItem(CHAVE_PUSH, "true"); setNotificacoesAtivas(true); setErro("");
    } catch (e) { setErro(e.message); throw e; }
  }
  return (
    <main className="min-h-screen w-full min-w-0 flex-1 p-4 font-poppins sm:p-3 lg:p-3">
      {/* topo */}
      <Header
        titulo="Lembretes"
        component2={
          <Botao
            nome="Novo Lembrete"
            tipoDado="button"
            clickHandler={() => setModalAberto(true)}
            Component={IconeMais}
            className="bg-pink-400 text-white rounded-2xl text-[18px] font-semibold p-5 sm:p-4 font-poppins flex gap-3 justify-center items-center cursor-pointer transition-transform duration-500 hover:scale-105 w-full md:w-80 focus:outline-none shadow-xl"
          />
        }
      />

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Sua rotina */}
        <section className="rounded-3xl bg-[#f5f5f5] p-4 shadow-md sm:p-6 mt-6">
          <h2 className="mb-6 font-playfair text-3xl  font-semibold sm:text-3xl text-pink-400 ">Sua rotina</h2>

          {erro && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
          {carregando ? <p className="rounded-2xl bg-white p-8 text-center text-gray-500">Carregando lembretes...</p> : ordenados.length === 0 ? (
            <p className="rounded-2xl bg-white p-8 text-center text-gray-500">
              Você ainda não tem lembretes. Toque em “Novo Lembrete” para começar.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {ordenados.map((l) => (
                <CartaoLembrete
                  key={l.id}
                  lembrete={l}
                  onToggle={() => alternar(l.id)}
                  onRemover={() => remover(l.id)}
                />
              ))}
            </ul>
          )}
        </section>

        {/* Coluna direita */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <section className="rounded-3xl bg-[#f5f5f5] p-4 shadow-md sm:p-6 mt-6">
            <h2 className="mb-6 font-playfair text-xl font-semibold sm:text-3xl text-pink-400">Resumo da semana</h2>

            <div className="mb-5 grid max-w-md grid-cols-7 gap-1.5 sm:gap-2">
              {DIAS_SEMANA.map((letra, i) => {
                const cumprido = i <= diaHoje;
                return (
                  <span
                    key={i}
                    title={NOMES_DIAS[i]}
                    className={`flex h-9 w-full items-center justify-center rounded-full text-base sm:text-lg ${
                      cumprido ? "bg-[#a8f0d8] text-[#1f9d8e]" : "bg-[#fbcfe3] text-[#d46a9a]"
                    } ${i === diaHoje ? "ring-2 ring-[#1f9d8e] ring-offset-2" : ""}`}
                  >
                    {letra}
                  </span>
                );
              })}
            </div>

            <p className="mb-4 flex items-center gap-3 text-base sm:text-lg">
              <FaCheckCircle className="text-[#1f9d8e]" />
              {totalAtivos} {totalAtivos === 1 ? "lembrete diário ativo" : "lembretes diários ativos"}
            </p>

            <div className="rounded-xl bg-[#fbcfe3] px-4 py-3 text-center text-[#7a2d52]">
              Próxima consulta: 12 de setembro, 9:00
            </div>
          </section>

          <aside className="rounded-2xl border border-[#f0a9c4] bg-[#fbcfe3]/60 p-4 text-sm text-[#9a3f69] sm:p-5 sm:text-base">
            Dica: manter horários regulares para medir a glicemia ajuda no controle do diabetes gestacional.
            <button type="button" onClick={() => ativarNotificacoes().catch(() => {})} className="ml-1 cursor-pointer font-semibold underline">{notificacoesAtivas ? "Notificações ativadas" : "Ative as notificações para não esquecer"}</button>
          </aside>
        </div>
      </div>

      <ModalNovoLembrete
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={adicionar}
      />
    </main>
  );
}

export default Lembretes;
