import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import Header from "../components/Header";
import { useUsuario } from "../context/UsuarioContext";
import { mensagemErro } from "../utils/mensagemErro";
import { LuSalad } from "react-icons/lu";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const ITENS_POR_PAGINA = 10;

const TIPOS_REFEICAO = [
  "Café da Manhã",
  "Lanche da Manhã",
  "Almoço",
  "Lanche da Tarde",
  "Jantar",
  "Ceia",
];

// Retorna a data e hora atual no horário local
function dataAtual() {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  const hora = String(agora.getHours()).padStart(2, "0");
  const minutos = String(agora.getMinutes()).padStart(2, "0");

  return `${ano}-${mes}-${dia}T${hora}:${minutos}`;
}

// Formulário inicial
const novoFormulario = () => ({
  tipo_refeicao: TIPOS_REFEICAO[0],
  descricao_alimentos: "",
  data_hora: dataAtual(),
});

// Formata a data para exibição
function formatarDataHora(valor) {
  if (!valor) return "";

  const data = new Date(String(valor).replace(" ", "T"));

  return Number.isNaN(data.getTime())
    ? valor
    : data.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      });
}

// Verifica a resposta da API
async function lerResposta(resposta) {
  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(
      dados?.erro || dados?.mensagem || "Não foi possível concluir a operação.",
    );
  }

  return dados;
}

function DiarioAlimentar() {
  const usuario = useUsuario();
  const idUsuario = usuario?.id_usuario;
  const ehGestante = String(usuario?.perfil || "").toLowerCase() === "gestante";
  const acompanhanteSemVinculo = String(usuario?.perfil || "").trim().toLowerCase() === "acompanhante" && !usuario?.id_gestante;

  const [refeicoes, setRefeicoes] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [refeicaoEditando, setRefeicaoEditando] = useState(null);
  const [formulario, setFormulario] = useState(novoFormulario);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [descricoesExpandidas, setDescricoesExpandidas] = useState({});

  const formularioRef = useRef(null);
  const paginaAtual = Math.min(pagina, totalPaginas);

  useEffect(() => {
    if (!formularioAberto || !window.matchMedia("(max-width: 639px)").matches) {
      return;
    }

    formularioRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [formularioAberto, refeicaoEditando]);

  // Buscar refeições na API
  const buscarRefeicoes = useCallback(async () => {
    if (!ehGestante && !usuario?.id_gestante) {
      return { refeicoes: [], totalPaginas: 1 };
    }
    if (!idUsuario) {
      return {
        refeicoes: [],
        totalPaginas: 1,
      };
    }

    const resposta = await fetch(
      ehGestante
        ? `${API}/diario/listar-refeicoes/usuario/${encodeURIComponent(idUsuario)}?limit=${ITENS_POR_PAGINA}&offset=${(pagina - 1) * ITENS_POR_PAGINA}`
        : `${API}/diario/listar-refeicoes-acompanhante/${encodeURIComponent(usuario?.id_gestante)}?limit=${ITENS_POR_PAGINA}&offset=${(pagina - 1) * ITENS_POR_PAGINA}`,
      { credentials: "include" },
    );

    const dados = await lerResposta(resposta);

    return {
      refeicoes: ehGestante ? (dados?.refeicoes ?? []) : (dados?.diario ?? []),
      totalPaginas: Math.max(1, dados?.paginacao?.total_paginas ?? 1),
    };
  }, [idUsuario, usuario?.id_gestante, ehGestante, pagina]);

  // Carregar refeições quando a página ou usuário mudar
  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      try {
        const dados = await buscarRefeicoes();

        if (cancelado) return;

        setRefeicoes(dados.refeicoes);
        setTotalPaginas(dados.totalPaginas);
        setErro("");
      } catch (error) {
        if (!cancelado) {
          setErro(mensagemErro(error, "Falha ao carregar o diário alimentar."));
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }

    carregar();

    return () => {
      cancelado = true;
    };
  }, [buscarRefeicoes]);

  // Abrir novo formulário
  function abrirNovo() {
    setRefeicaoEditando(null);
    setFormulario(novoFormulario());
    setErro("");
    setFormularioAberto(true);
  }

  // Abrir formulário de edição
  function abrirEdicao(refeicao) {
    const dataHora = String(refeicao.data_hora || "")
      .replace(" ", "T")
      .slice(0, 16);

    setRefeicaoEditando(refeicao);

    setFormulario({
      tipo_refeicao: refeicao.tipo_refeicao,
      descricao_alimentos: refeicao.descricao_alimentos || "",
      data_hora: dataHora,
    });

    setErro("");
    setFormularioAberto(true);
  }

  // Salvar refeição
  async function salvarRefeicao(event) {
    event.preventDefault();

    if (!idUsuario) {
      setErro("Não foi possível identificar o usuário da sessão.");
      return;
    }

    const descricaoAlimentos = formulario.descricao_alimentos.trim();

    if (!descricaoAlimentos) {
      setErro("Informe os alimentos da refeição.");
      return;
    }

    setSalvando(true);
    setErro("");

    const editar = Boolean(refeicaoEditando);
    const id = refeicaoEditando?.id_refeicao;

    const payload = {
      ...formulario,
      descricao_alimentos: descricaoAlimentos,
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dados: payload }),
        },
      );

      await lerResposta(resposta);

      setFormularioAberto(false);
      setRefeicaoEditando(null);

      const dados = await buscarRefeicoes();

      setRefeicoes(dados.refeicoes);
      setTotalPaginas(dados.totalPaginas);
    } catch (error) {
      setErro(mensagemErro(error, "Falha ao salvar a refeição."));
    } finally {
      setSalvando(false);
    }
  }

  // Excluir refeição
  async function excluirRefeicao(refeicao) {
    const id = refeicao.id_refeicao;

    if (!id) return;

    setErro("");

    try {
      const resposta = await fetch(
        `${API}/diario/remover-refeicao/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      await lerResposta(resposta);

      setRefeicoes((atuais) =>
        atuais.filter((item) => item.id_refeicao !== id),
      );
    } catch (error) {
      setErro(mensagemErro(error, "Falha ao excluir a refeição."));
    }
  }

  return (
    <>
      <Header
        titulo="Diário Alimentar"
        tituloClassName={"text-4xl sm:text-5xl"}
        component={
          <LuSalad className="text-pink-400 text-5xl  transition-transform duration-500 hover:scale-105 " aria-hidden="true" />
        }
        component2={ehGestante ? (
          <button
            type="button"
            onClick={abrirNovo}
            className="bg-teal-600 text-white rounded-2xl text-[18px] font-semibold p-5 sm:p-4 font-poppins flex gap-3 justify-center items-center cursor-pointer transition-transform duration-500 hover:scale-105 w-full md:w-80 focus:outline-none shadow-xl"
          >
            <FiPlus aria-hidden="true" /> Adicionar refeição
          </button>
        ) : null}
      />

      {acompanhanteSemVinculo ? (
        <section className="mx-auto mt-10 flex min-h-[40vh] w-full max-w-3xl items-center justify-center rounded-3xl border-2 border-pink-300 bg-white px-6 py-12 text-center shadow-xl" role="status">
          <p className="text-2xl font-bold leading-relaxed text-pink-600 sm:text-4xl">Você ainda não está vinculado a uma gestante.</p>
        </section>
      ) : <section className="mx-auto mt-8 w-full max-w-4xl rounded-3xl border border-gray-300 bg-gray-50 px-6 py-6 shadow-sm sm:px-10">
        <h3 className="mb-6 text-center font-playfair text-4xl font-bold text-pink-400">
          Refeições registradas
        </h3>

        {erro && !formularioAberto && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-red-50 p-3 text-center text-red-700"
          >
            {erro}
          </p>
        )}

        {ehGestante && formularioAberto && (
          <form
            ref={formularioRef}
            onSubmit={salvarRefeicao}
            className="mb-7 scroll-mt-4 rounded-2xl border border-teal-200 bg-white p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="text-xl font-semibold text-teal-800">
                {refeicaoEditando ? "Editar refeição" : "Nova refeição"}
              </h4>

              <button
                type="button"
                aria-label="Fechar formulário"
                onClick={() => setFormularioAberto(false)}
                className="rounded p-2 text-gray-600 hover:bg-gray-100"
              >
                <FiX />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 font-medium text-gray-700">
                Tipo de refeição
                <select
                  required
                  value={formulario.tipo_refeicao}
                  onChange={(event) =>
                    setFormulario({
                      ...formulario,
                      tipo_refeicao: event.target.value,
                    })
                  }
                  className="rounded-lg border border-gray-300 p-3"
                >
                  {TIPOS_REFEICAO.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 font-medium text-gray-700">
                Data e hora
                <input
                  required
                  type="datetime-local"
                  max={dataAtual()}
                  value={formulario.data_hora}
                  onChange={(event) =>
                    setFormulario({
                      ...formulario,
                      data_hora: event.target.value,
                    })
                  }
                  className="rounded-lg border border-gray-300 p-3"
                />
              </label>

              <label className="flex flex-col gap-1 font-medium text-gray-700 sm:col-span-2">
                Alimentos (até 255 caracteres)
                <textarea
                  required
                  maxLength={255}
                  rows={3}
                  value={formulario.descricao_alimentos}
                  onChange={(event) =>
                    setFormulario({
                      ...formulario,
                      descricao_alimentos: event.target.value,
                    })
                  }
                  className="resize-y rounded-lg border border-gray-300 p-3"
                  placeholder="Descreva o que você comeu"
                />
              </label>
            </div>

            {erro && (
              <p role="alert" className="mt-3 text-sm text-red-700">
                {erro}
              </p>
            )}

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormularioAberto(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700"
              >
                Cancelar
              </button>

              <button
                disabled={salvando}
                type="submit"
                className="rounded-lg bg-teal-600 px-5 py-2 font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Salvar refeição"}
              </button>
            </div>
          </form>
        )}

        {carregando ? (
          <p className="py-8 text-center text-gray-600">
            Carregando refeições...
          </p>
        ) : refeicoes.length === 0 ? (
          <p className="py-8 text-center text-gray-600">
            Você ainda não registrou nenhuma refeição.
          </p>
        ) : (
          <ul className="flex flex-col">
            {refeicoes.map((refeicao) => (
              <li
                key={refeicao.id_refeicao}
                className="flex min-w-0 flex-col justify-between gap-4 border-b border-pink-200 py-4 last:border-b-0 sm:flex-row sm:items-start"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-pink-400"
                  />

                  <div className="min-w-0 flex-1 font-poppins">
                    <h4 className="break-words text-lg font-semibold text-pink-500 sm:text-2xl">
                      {refeicao.tipo_refeicao}
                    </h4>

                    <p
                      className={`mt-2 whitespace-pre-wrap break-all text-base font-semibold text-teal-700 sm:text-xl ${
                        descricoesExpandidas[refeicao.id_refeicao]
                          ? ""
                          : "line-clamp-3"
                      }`}
                    >
                      {refeicao.descricao_alimentos}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-1 sm:gap-2">
                      <time className="break-words text-base text-gray-500 sm:text-2xl">
                        {formatarDataHora(refeicao.data_hora)}
                      </time>

                      {refeicao.descricao_alimentos?.length > 100 && (
                        <button
                          type="button"
                          onClick={() =>
                            setDescricoesExpandidas((atuais) => ({
                              ...atuais,
                              [refeicao.id_refeicao]:
                                !atuais[refeicao.id_refeicao],
                            }))
                          }
                          aria-label={
                            descricoesExpandidas[refeicao.id_refeicao]
                              ? "Recolher descrição"
                              : "Expandir descrição"
                          }
                          aria-expanded={Boolean(
                            descricoesExpandidas[refeicao.id_refeicao],
                          )}
                          className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 hover:text-teal-900 focus:outline-none sm:text-base"
                        >
                          {descricoesExpandidas[refeicao.id_refeicao]
                            ? "Ver menos"
                            : "Ver mais"}
                        </button>
                      )}
                    </div>

                    {refeicao.foto_url && (
                      <a
                        className="mt-1 inline-block text-sm text-teal-700 text-[15px] underline"
                        href={refeicao.foto_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver foto
                      </a>
                    )}
                  </div>
                </div>

                {ehGestante && <div className="flex items-center gap-2 self-end sm:self-start">
                  <button
                    type="button"
                    onClick={() => abrirEdicao(refeicao)}
                    aria-label={`Editar ${refeicao.tipo_refeicao}`}
                    className="rounded-lg p-2 text-teal-700 text-2xl hover:bg-teal-50"
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    type="button"
                    onClick={() => excluirRefeicao(refeicao)}
                    aria-label={`Excluir ${refeicao.tipo_refeicao}`}
                    className="rounded-lg p-2 text-red-700 text-2xl hover:bg-red-50"
                  >
                    <FiTrash2 />
                  </button>
                </div>}
              </li>
            ))}
          </ul>
        )}

        {!carregando && totalPaginas > 1 && (
          <nav
            aria-label="Paginação das refeições"
            className="mt-5 flex items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={() => setPagina((atual) => Math.max(1, atual - 1))}
              disabled={pagina === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-pink-200 px-3 py-2 text-pink-700 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiChevronLeft aria-hidden="true" /> Anterior
            </button>

            <span aria-live="polite" className="text-sm text-gray-600">
              Página {paginaAtual} de {totalPaginas}
            </span>

            <button
              type="button"
              onClick={() =>
                setPagina((atual) => Math.min(totalPaginas, atual + 1))
              }
              disabled={paginaAtual === totalPaginas}
              className="inline-flex items-center gap-1 rounded-lg border border-pink-200 px-3 py-2 text-pink-700 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Avançar <FiChevronRight aria-hidden="true" />
            </button>
          </nav>
        )}
      </section>}
    </>
  );
}

export default DiarioAlimentar;
