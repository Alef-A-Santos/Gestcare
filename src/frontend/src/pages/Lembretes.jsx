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
  FaPen,
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
const CHAVE_CATEGORIAS_LEMBRETES = "gestcare_categorias_lembretes";
const CATEGORIAS_API = {
  Glicemia: "glicemia",
  "Medicação": "medicao",
  Alimentação: "alimentacao",
  Consulta: "consulta",
  "Hidratação": "hidratacao",
};
const normalizarCategoria = (valor) => String(valor || "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const CATEGORIAS_POR_CHAVE = Object.fromEntries(
  Object.keys(CATEGORIAS).map((nome) => [normalizarCategoria(nome), nome])
);
CATEGORIAS_POR_CHAVE.medicao = "Medicação";

function chaveLembrete(lembrete) {
  const recorrencia = Array.isArray(lembrete.recorrencia)
    ? lembrete.recorrencia.join(",")
    : String(lembrete.recorrencia || "");
  return [lembrete.titulo, String(lembrete.horario || lembrete.hora || "").slice(0, 5), recorrencia]
    .map((parte) => String(parte || "").trim().toLowerCase())
    .join("|");
}

function lerCategoriasSalvas() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_CATEGORIAS_LEMBRETES) || "{}");
  } catch {
    return {};
  }
}

function obterRecorrencia(lembrete) {
  if (Array.isArray(lembrete.recorrencia)) return lembrete.recorrencia.map(Number).filter(Number.isInteger);
  const texto = String(lembrete.recorrencia || "").trim();
  return /^\d(?:,\d)*$/.test(texto) ? texto.split(",").map(Number) : [];
}

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

function CartaoLembrete({ lembrete, onToggle, onRemover, onEditar }) {
  const categoriaNome = CATEGORIAS_POR_CHAVE[normalizarCategoria(lembrete.categoria || lembrete.tipo)] || "Glicemia";
  const cat = CATEGORIAS[categoriaNome];
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
          <p className="text-sm text-gray-500">{lembrete.hora} - {lembrete.frequencia}</p>
          <span className={`rounded-full px-3 py-0.5 text-xs font-medium sm:hidden ${cat.tag}`}>
            {categoriaNome}
          </span>
        </div>
      </div>

      <span className={`hidden rounded-full px-4 py-1 text-sm font-medium sm:inline-block ${cat.tag}`}>
        {categoriaNome}
      </span>

      <button
        type="button"
        onClick={onEditar}
        aria-label={`Editar lembrete ${lembrete.titulo}`}
        className="cursor-pointer rounded-full p-2 text-gray-400 transition hover:bg-emerald-50 hover:text-[#1f9d8e]"
      >
        <FaPen size={14} />
      </button>

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

function ModalNovoLembrete({ aberto, lembrete, onFechar, onSalvar }) {
  const [titulo, setTitulo] = useState("");
  const [hora, setHora] = useState("");
  const [categoria, setCategoria] = useState("Glicemia");
  const [frequencia, setFrequencia] = useState("diaria");
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!aberto) return;
    setTitulo(lembrete?.titulo || "");
    setHora(lembrete?.hora || "");
    setCategoria(lembrete?.categoria || "Glicemia");
    const dias = lembrete ? obterRecorrencia(lembrete) : [];
    setFrequencia(dias.length > 0 && dias.length < 7 ? "dias" : "diaria");
    setDiasSelecionados(dias);
    setErro("");
  }, [aberto, lembrete]);

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  function enviar(e) {
    e.preventDefault();
    if (!titulo.trim() || !hora || (frequencia === "dias" && diasSelecionados.length === 0)) {
      setErro("Preencha o nome e o horário do lembrete.");
      return;
    }
    onSalvar({ titulo: titulo.trim(), hora, categoria, frequencia, diasSelecionados });
    setTitulo("");
    setHora("");
    setCategoria("Glicemia");
    setFrequencia("diaria");
    setDiasSelecionados([]);
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
            {lembrete ? "Editar lembrete" : "Novo lembrete"}
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

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-gray-600">Frequência</span>
          <select className={campo} value={frequencia} onChange={(e) => setFrequencia(e.target.value)}>
            <option value="diaria">Todos os dias</option>
            <option value="dias">Dias específicos da semana</option>
          </select>
        </label>
        {frequencia === "dias" && (
          <fieldset className="mb-4">
            <legend className="mb-2 block text-sm font-medium text-gray-600">Selecione os dias</legend>
            <div className="grid grid-cols-7 gap-2">
              {DIAS_SEMANA.map((dia, indice) => {
                const selecionado = diasSelecionados.includes(indice);
                return <button key={indice} type="button" aria-pressed={selecionado} aria-label={NOMES_DIAS[indice]} title={NOMES_DIAS[indice]}
                  onClick={() => setDiasSelecionados((atuais) => selecionado ? atuais.filter((d) => d !== indice) : [...atuais, indice].sort())}
                  className={`h-10 rounded-full font-medium transition ${selecionado ? "bg-[#1f9d8e] text-white" : "bg-[#f3e6ec] text-[#7a2d52]"}`}>{dia}</button>;
              })}
            </div>
          </fieldset>
        )}
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
  const [lembreteEmEdicao, setLembreteEmEdicao] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(() => localStorage.getItem(CHAVE_PUSH) === "true");
  const [diaSelecionado, setDiaSelecionado] = useState(() => new Date().getDay());

  useEffect(() => {
    let ativo = true;
    async function verificarInscricao() {
      try {
        const inscricao = "serviceWorker" in navigator && "Notification" in window && Notification.permission === "granted"
          ? await navigator.serviceWorker.getRegistration("/")
          : null;
        const ativada = Boolean(inscricao && await inscricao.pushManager.getSubscription());
        if (ativo) {
          setNotificacoesAtivas(ativada);
          localStorage.setItem(CHAVE_PUSH, String(ativada));
        }
      } catch {
        if (ativo) setNotificacoesAtivas(false);
      }
    }
    verificarInscricao();
    return () => { ativo = false; };
  }, []);

  async function requisitar(url, opcoes = {}) {
    const resposta = await fetch(`${API}${url}`, { credentials: "include", ...opcoes,
      headers: { "Content-Type": "application/json", ...opcoes.headers } });
    const dados = await resposta.json().catch(() => null);
    if (!resposta.ok) throw new Error(dados?.erro || dados?.mensagem || "Não foi possível concluir a operação.");
    return dados;
  }

  const normalizar = (l) => {
    const categoriaSalva = lerCategoriasSalvas()[chaveLembrete(l)];
    const categoria = CATEGORIAS_POR_CHAVE[normalizarCategoria(l.categoria || l.tipo || categoriaSalva)] || "Glicemia";
    // O backend grava os dias no banco como "0,2,4"; converte de volta
    // para números antes de montar a frequência exibida.
    const recorrencia = Array.isArray(l.recorrencia)
      ? l.recorrencia.map(Number)
      : typeof l.recorrencia === "string" && /^\d(?:,\d)*$/.test(l.recorrencia)
        ? l.recorrencia.split(",").map(Number)
        : [];
    return {
      ...l,
      id: l.id_lembrete,
      hora: String(l.horario || "").slice(0, 5),
      frequencia: recorrencia.length > 0 && recorrencia.length < 7
        ? recorrencia.map((dia) => NOMES_DIAS[dia]).join(", ")
        : "Todos os dias",
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
  const lembretesDoDiaSelecionado = lembretes.filter((lembrete) => {
    if (!lembrete.ativo) return false;
    const recorrencia = obterRecorrencia(lembrete);
    return recorrencia.length === 0 || recorrencia.includes(diaSelecionado);
  });
  const proximoLembrete = lembretes.filter((lembrete) => lembrete.ativo).map((lembrete) => {
    const agora = new Date();
    const recorrencia = obterRecorrencia(lembrete);
    const dias = recorrencia.length ? recorrencia : DIAS_SEMANA.map((_, i) => i);
    const [hora = 0, minuto = 0] = String(lembrete.hora || "00:00").split(":").map(Number);
    const datas = dias.map((dia) => {
      const data = new Date(agora);
      data.setDate(data.getDate() + ((dia - agora.getDay() + 7) % 7));
      data.setHours(hora, minuto, 0, 0);
      if (data <= agora) data.setDate(data.getDate() + 7);
      return data;
    });
    return { lembrete, data: datas.sort((a, b) => a - b)[0] };
  }).sort((a, b) => a.data - b.data)[0];

  async function alternar(id) {
    const lembrete = lembretes.find((l) => l.id === id);
    if (!lembrete) return;
    try {
      // A API atual valida o status com truthiness; enviar 0 booleano falha,
      // mas a string "0" é aceita e continua sendo convertida para zero no SQL.
      await requisitar(`/lembretes/alterar-status-lembrete/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status: lembrete.ativo ? "0" : 1 }),
      });
      await carregarLembretes();
      setErro("");
    } catch (e) { setErro(e.message); }
  }

  function remover(id) {
    requisitar(`/lembretes/deletar-lembrete/${encodeURIComponent(id)}`, { method: "DELETE" }).then(carregarLembretes).catch((e) => setErro(e.message));
  }

  async function adicionar(novo) {
    try {
      // Só solicita/cadastra a subscription quando as notificações ainda não
      // estão ativadas para este usuário neste navegador.
      if (!notificacoesAtivas) await ativarNotificacoes();
      const recorrencia = novo.frequencia === "dias" ? novo.diasSelecionados : [0, 1, 2, 3, 4, 5, 6];
      await requisitar("/lembretes/criar-lembrete", { method: "POST", credentials: "include", body: JSON.stringify({ dados: {
        titulo: novo.titulo, horario: novo.hora, categoria: CATEGORIAS_API[novo.categoria] || CATEGORIAS_API.Glicemia,
        recorrencia,
        horario_fixo: true, periodicamente: true,
      } }) });
      const categoriasSalvas = lerCategoriasSalvas();
      categoriasSalvas[chaveLembrete({ titulo: novo.titulo, horario: novo.hora, recorrencia })] = novo.categoria;
      localStorage.setItem(CHAVE_CATEGORIAS_LEMBRETES, JSON.stringify(categoriasSalvas));
      await carregarLembretes(); setModalAberto(false); setErro("");
    } catch (e) { setErro(e.message); }
  }
  async function salvarEdicao(dados) {
    if (!lembreteEmEdicao) return adicionar(dados);
    try {
      const recorrencia = dados.frequencia === "dias" ? dados.diasSelecionados : [0, 1, 2, 3, 4, 5, 6];
      await requisitar(`/lembretes/editar-lembrete/${encodeURIComponent(lembreteEmEdicao.id)}`, {
        method: "PUT",
        body: JSON.stringify({ dados: {
          titulo: dados.titulo,
          horario: dados.hora,
          categoria: CATEGORIAS_API[dados.categoria] || CATEGORIAS_API.Glicemia,
          recorrencia,
          periodicamente: true,
          horario_fixo: true,
        } }),
      });
      const categoriasSalvas = lerCategoriasSalvas();
      categoriasSalvas[chaveLembrete({ titulo: dados.titulo, horario: dados.hora, recorrencia })] = dados.categoria;
      localStorage.setItem(CHAVE_CATEGORIAS_LEMBRETES, JSON.stringify(categoriasSalvas));
      await carregarLembretes();
      setModalAberto(false);
      setLembreteEmEdicao(null);
      setErro("");
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
      const reg = await navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" });
      await reg.update();
      await navigator.serviceWorker.ready;
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
            clickHandler={() => { setLembreteEmEdicao(null); setModalAberto(true); }}
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
              Você ainda não tem lembretes. Toque em Novo Lembrete para começar.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {ordenados.map((l) => (
                <CartaoLembrete
                  key={l.id}
                  lembrete={l}
                  onToggle={() => alternar(l.id)}
                  onRemover={() => remover(l.id)}
                  onEditar={() => { setLembreteEmEdicao(l); setModalAberto(true); }}
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
                  <button
                    type="button"
                    onClick={() => setDiaSelecionado(i)}
                    aria-pressed={diaSelecionado === i}
                    key={i}
                    title={NOMES_DIAS[i]}
                    className={`flex h-9 w-full items-center justify-center rounded-full text-base sm:text-lg ${
                      cumprido ? "bg-[#a8f0d8] text-[#1f9d8e]" : "bg-[#fbcfe3] text-[#d46a9a]"
                    } ${diaSelecionado === i ? "ring-2 ring-[#1f9d8e] ring-offset-2" : ""} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500`}
                  >
                    {lembretes.some((lembrete) => {
                      if (!lembrete.ativo) return false;
                      const recorrencia = obterRecorrencia(lembrete);
                      return recorrencia.length === 0 || recorrencia.includes(i);
                    }) ? <span className="relative">{letra}<span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-pink-500" /></span> : letra}
                  </button>
                );
              })}
            </div>

            {lembretesDoDiaSelecionado.length > 0 ? (
              <ul className="mb-5 space-y-2 rounded-xl bg-white/70 p-4 text-sm text-zinc-700">
                <li><span className="font-semibold">{NOMES_DIAS[diaSelecionado]}:</span>{" "}
                  {lembretesDoDiaSelecionado.map((lembrete) => `${lembrete.titulo} (${lembrete.hora})`).join(", ")}
                </li>
              </ul>
            ) : <p className="mb-5 text-sm text-zinc-500">Nenhum lembrete ativo na {NOMES_DIAS[diaSelecionado].toLowerCase()}.</p>}

            <p className="mb-4 flex items-center gap-3 text-base sm:text-lg">
              <FaCheckCircle className="text-[#1f9d8e]" />
              {totalAtivos} {totalAtivos === 1 ? "lembrete diário ativo" : "lembretes diários ativos"}
            </p>

            <div className="rounded-xl bg-[#fbcfe3] px-4 py-3 text-center text-[#7a2d52]">
              {proximoLembrete ? <>Próximo lembrete: <strong>{proximoLembrete.lembrete.titulo}</strong> em {proximoLembrete.data.toLocaleString("pt-BR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</> : "Nenhum próximo lembrete"}
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
        lembrete={lembreteEmEdicao}
        onFechar={() => { setModalAberto(false); setLembreteEmEdicao(null); }}
        onSalvar={salvarEdicao}
      />
    </main>
  );
}

export default Lembretes;
