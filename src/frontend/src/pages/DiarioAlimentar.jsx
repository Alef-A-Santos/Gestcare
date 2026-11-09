import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import Header from "../components/Header";
import { useUsuario } from "../context/UsuarioContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const TIPOS_REFEICAO = [
  "Café da Manhã",
  "Lanche da Manhã",
  "Almoço",
  "Lanche da Tarde",
  "Jantar",
  "Ceia",
];

const novoFormulario = () => ({
  tipo_refeicao: TIPOS_REFEICAO[0],
  descricao_alimentos: "",
  data_hora: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16),
});

function formatarDataHora(valor) {
  if (!valor) return "";
  const data = new Date(String(valor).replace(" ", "T"));
  return Number.isNaN(data.getTime())
    ? valor
    : data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

async function lerResposta(resposta) {
  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new Error(dados?.erro || dados?.mensagem || "Não foi possível concluir a operação.");
  }
  return dados;
}

function DiarioAlimentar() {
  const usuario = useUsuario();
  const idUsuario = usuario?.id_usuario;
  const [refeicoes, setRefeicoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [refeicaoEditando, setRefeicaoEditando] = useState(null);
  const [formulario, setFormulario] = useState(novoFormulario);

  const carregarRefeicoes = useCallback(async () => {
    if (!idUsuario) return;
    setCarregando(true);
    setErro("");
    try {
      const resposta = await fetch(
        `${API}/diario/listar-refeicoes/usuario/${encodeURIComponent(idUsuario)}`,
        { credentials: "include" },
      );
      const dados = await lerResposta(resposta);
      setRefeicoes(dados?.refeicoes ?? []);
    } catch (error) {
      setErro(error.message || "Falha ao carregar o diário alimentar.");
    } finally {
      setCarregando(false);
    }
  }, [idUsuario]);

  useEffect(() => {
     () => carregarRefeicoes() ( )
  }, [carregarRefeicoes]);

  function abrirNovo() {
    setRefeicaoEditando(null);
    setFormulario(novoFormulario());
    setErro("");
    setFormularioAberto(true);
  }

  function abrirEdicao(refeicao) {
    const dataHora = String(refeicao.data_hora || "").replace(" ", "T").slice(0, 16);
    setRefeicaoEditando(refeicao);
    setFormulario({
      tipo_refeicao: refeicao.tipo_refeicao,
      descricao_alimentos: refeicao.descricao_alimentos || "",
      data_hora: dataHora,
    });
    setErro("");
    setFormularioAberto(true);
  }

  async function salvarRefeicao(event) {
    event.preventDefault();
    if (!idUsuario) {
      setErro("Não foi possível identificar o usuário da sessão.");
      return;
    }
    setSalvando(true);
    setErro("");
    const editar = Boolean(refeicaoEditando);
    const id = refeicaoEditando?.id_refeicao;
    const payload = {
      ...formulario,
      data_hora: formulario.data_hora,
      ...(!editar && { id_usuario: idUsuario }),
    };

    try {
      const resposta = await fetch(
        editar
          ? `${API}/diario/alterar-refeicao/${encodeURIComponent(id)}`
          : `${API}/diario/cadastrar-refeicao`,
        {
          method: editar ? "PATCH" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dados: payload }),
        },
      );
      await lerResposta(resposta);
      setFormularioAberto(false);
      setRefeicaoEditando(null);
      await carregarRefeicoes();
    } catch (error) {
      setErro(error.message || "Falha ao salvar a refeição.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirRefeicao(refeicao) {
    const id = refeicao.id_refeicao;
    if (!id) return;
    setErro("");
    try {
      const resposta = await fetch(
        `${API}/diario/remover-refeicao/${encodeURIComponent(id)}`,
        { method: "DELETE", credentials: "include" },
      );
      await lerResposta(resposta);
      setRefeicoes((atuais) => atuais.filter((item) => item.id_refeicao !== id));
    } catch (error) {
      setErro(error.message || "Falha ao excluir a refeição.");
    }
  }

  return (
    <>
      <Header
        titulo="Diário Alimentar"
        component2={
          <button
            type="button"
            onClick={abrirNovo}
            className="bg-teal-600 text-white rounded-2xl text-[18px] font-semibold p-5 sm:p-4 font-poppins flex gap-3 justify-center items-center cursor-pointer transition-transform duration-500 hover:scale-105 w-full md:w-80 focus:outline-none shadow-xl"
          >
            <FiPlus aria-hidden="true" /> Adicionar refeição
          </button>
        }
      />

      <section className="mx-auto mt-8 w-full max-w-4xl rounded-3xl border border-gray-300 bg-gray-50 px-6 py-6 shadow-sm sm:px-10">
        <h3 className="mb-6 text-center font-poppins text-3xl font-semibold text-pink-400">
          Refeições registradas
        </h3>

        {erro && !formularioAberto && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-center text-red-700">{erro}</p>
        )}

        {formularioAberto && (
          <form onSubmit={salvarRefeicao} className="mb-7 rounded-2xl border border-teal-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="text-xl font-semibold text-teal-800">
                {refeicaoEditando ? "Editar refeição" : "Nova refeição"}
              </h4>
              <button type="button" aria-label="Fechar formulário" onClick={() => setFormularioAberto(false)} className="rounded p-2 text-gray-600 hover:bg-gray-100">
                <FiX />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 font-medium text-gray-700">
                Tipo de refeição
                <select required value={formulario.tipo_refeicao} onChange={(event) => setFormulario({ ...formulario, tipo_refeicao: event.target.value })} className="rounded-lg border border-gray-300 p-3">
                  {TIPOS_REFEICAO.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1 font-medium text-gray-700">
                Data e hora
                <input required type="datetime-local" value={formulario.data_hora} onChange={(event) => setFormulario({ ...formulario, data_hora: event.target.value })} className="rounded-lg border border-gray-300 p-3" />
              </label>
              <label className="flex flex-col gap-1 font-medium text-gray-700 sm:col-span-2">
                Alimentos (até 255 caracteres)
                <textarea required maxLength={255} rows={3} value={formulario.descricao_alimentos} onChange={(event) => setFormulario({ ...formulario, descricao_alimentos: event.target.value })} className="resize-y rounded-lg border border-gray-300 p-3" placeholder="Descreva o que você comeu" />
              </label>
            </div>
            {erro && <p role="alert" className="mt-3 text-sm text-red-700">{erro}</p>}
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setFormularioAberto(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700">Cancelar</button>
              <button disabled={salvando} type="submit" className="rounded-lg bg-teal-600 px-5 py-2 font-semibold text-white hover:bg-teal-700 disabled:opacity-60">
                {salvando ? "Salvando..." : "Salvar refeição"}
              </button>
            </div>
          </form>
        )}

        {carregando ? (
          <p className="py-8 text-center text-gray-600">Carregando refeições...</p>
        ) : refeicoes.length === 0 ? (
          <p className="py-8 text-center text-gray-600">Você ainda não registrou nenhuma refeição.</p>
        ) : (
          <ul className="flex flex-col">
            {refeicoes.map((refeicao) => (
              <li key={refeicao.id_refeicao} className="flex flex-col justify-between gap-4 border-b border-pink-200 py-4 last:border-b-0 sm:flex-row sm:items-start">
                <div className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-pink-400" />
                  <div className="font-poppins">
                    <h4 className="font-semibold text-pink-500">{refeicao.tipo_refeicao}</h4>
                    <p className="mt-1 text-gray-800">{refeicao.descricao_alimentos}</p>
                    <time className="mt-1 block text-sm text-gray-500">{formatarDataHora(refeicao.data_hora)}</time>
                    {refeicao.foto_url && <a className="mt-1 inline-block text-sm text-teal-700 underline" href={refeicao.foto_url} target="_blank" rel="noreferrer">Ver foto</a>}
                  </div>
                </div>
                <div className="flex gap-2 self-end sm:self-start">
                  <button type="button" onClick={() => abrirEdicao(refeicao)} aria-label={`Editar ${refeicao.tipo_refeicao}`} className="rounded-lg p-2 text-teal-700 hover:bg-teal-50"><FiEdit2 /></button>
                  <button type="button" onClick={() => excluirRefeicao(refeicao)} aria-label={`Excluir ${refeicao.tipo_refeicao}`} className="rounded-lg p-2 text-red-700 hover:bg-red-50"><FiTrash2 /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default DiarioAlimentar;