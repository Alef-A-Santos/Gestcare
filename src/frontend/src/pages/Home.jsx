
import { useEffect, useState } from "react";

import Header from "../components/Header";
import CardInfo from "../components/CardInfo";
import CardMedia from "../components/CardMedia";
import CardGestacao from "../components/CardGestacao";
import CardDiario from "../components/CardDiario";
import CardMarco from "../components/CardMarco";
import CardLembrete from "../components/CardLembrete";
import UserName from "../components/UserName";
import Botao from "../components/Botao";
import { useUsuario } from "../context/UsuarioContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function formatarDataParto(valor) {
  if (!valor) return "";

  const texto = String(valor).trim();
  // Datas em YYYY-MM-DD (inclusive timestamp ISO) devem ser interpretadas
  // como data de calendário para evitar mudança de dia por fuso horário.
  const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;

  const brasileira = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (brasileira) {
    const [, dia, mes, ano] = brasileira;
    return `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}/${ano.length === 2 ? `20${ano}` : ano}`;
  }

  const data = new Date(texto);
  return Number.isNaN(data.getTime()) ? texto : data.toLocaleDateString("pt-BR");
}

function Home() {
  const usuario = useUsuario();
  const [resumo, setResumo] = useState(null);
  const [refeicoes, setRefeicoes] = useState([]);
  const [erro, setErro] = useState("");

  // Estados do relatório
  const [mostrarPeriodo, setMostrarPeriodo] = useState(false);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [erroPdf, setErroPdf] = useState("");

  // Datas do relatório
  const hoje = new Date();

  const dataLocal = (data) =>
    `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;

  const primeiroDiaMes = dataLocal(
    new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  );

  const [dataInicio, setDataInicio] = useState(primeiroDiaMes);
  const [dataFim, setDataFim] = useState(dataLocal(hoje));

  // Classificação da última medição
  const classificacaoBackend = String(
    resumo?.ultima_medicao?.classificacao || ""
  ).trim();

  const classificacoes = {
    A: "Alta",
    B: "Baixa",
    N: "Normal",
  };

  const codigoClassificacao = classificacaoBackend.toUpperCase();

  const classificacaoUltima =
    classificacoes[codigoClassificacao] ||
    ({
      alta: "Alta",
      baixa: "Baixa",
      normal: "Normal",
    }[classificacaoBackend.toLowerCase()]) ||
    "Sem dados";

  // Gerar relatório PDF
  async function gerarRelatorio() {
    setErroPdf("");

    if (!dataInicio || !dataFim || dataInicio > dataFim) {
      setErroPdf("Selecione um período válido.");
      return;
    }

    if (dataInicio.slice(0, 4) !== dataFim.slice(0, 4)) {
      setErroPdf("O período precisa estar dentro do mesmo ano.");
      return;
    }

    setGerandoPdf(true);

    try {
      const resposta = await fetch(
        `${API}/relatorio/gerar-relatorio`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dados: {
              data_inicio: dataInicio,
              data_fim: dataFim,
              ano: Number(dataInicio.slice(0, 4)),
            },
          }),
        }
      );

      const tipoResposta = resposta.headers.get("content-type") || "";

      if (tipoResposta.includes("application/json")) {
        const resultado = await resposta.json().catch(() => null);

        if (resultado?.sem_registros) {
          setErroPdf(
            resultado.mensagem ||
              "Não há dados para gerar o relatório no período selecionado."
          );
          return;
        }

        if (!resposta.ok) {
          throw new Error(
            resultado?.erro || "Não foi possível gerar o relatório."
          );
        }

        throw new Error(
          resultado?.erro || "Não foi possível gerar o relatório."
        );
      }

      if (!resposta.ok) {
        throw new Error("Não foi possível gerar o relatório.");
      }

      const pdf = await resposta.blob();

      if (pdf.size === 0) {
        throw new Error("O relatório recebido está vazio.");
      }

      const url = URL.createObjectURL(pdf);
      const link = document.createElement("a");

      link.href = url;
      link.download = `relatorio_${dataInicio}_${dataFim}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setMostrarPeriodo(false);
    } catch (error) {
      setErroPdf(
        error.message || "Falha ao conectar com o servidor."
      );
    } finally {
      setGerandoPdf(false);
    }
  }

  // Carregar informações do dashboard
  useEffect(() => {
    let ativo = true;

    async function carregarDashboard() {
      // Aguarda o contexto de autenticação. A rota de resumo do backend só
      // atende gestantes, portanto os demais perfis não devem consultá-la.
      if (!usuario) return;
      if (String(usuario.perfil || "").trim().toLowerCase() !== "gestante") return;

      // As duas fontes são independentes: falha no diário não pode impedir
      // que glicemia, gestação e lembretes sejam carregados.
      const carregarRefeicoes = async () => {
        if (!usuario.id_usuario) return;
        const resposta = await fetch(
          `${API}/diario/listar-refeicoes/usuario/${encodeURIComponent(usuario.id_usuario)}`,
          { method: "GET", credentials: "include" }
        );
        const dados = await resposta.json().catch(() => null);
        if (!resposta.ok) {
          throw new Error(dados?.erro || "Falha ao carregar diário alimentar.");
        }
        const hoje = dataLocal(new Date());
        const lista = Array.isArray(dados?.refeicoes) ? dados.refeicoes : [];
        if (ativo) {
          setRefeicoes(lista.filter((refeicao) =>
            refeicao.data_hora && String(refeicao.data_hora).slice(0, 10) === hoje
          ));
        }
      };

      const carregarResumo = async () => {
        const resposta = await fetch(
          `${API}/dashboard/resumo`,
          { method: "GET", credentials: "include" }
        );
        const dados = await resposta.json().catch(() => null);
        if (!resposta.ok) {
          throw new Error(dados?.erro || "Não foi possível carregar o resumo do dashboard.");
        }
        if (ativo) setResumo(dados?.resumo ?? null);
      };

      const resultados = await Promise.allSettled([carregarRefeicoes(), carregarResumo()]);
      if (!ativo) return;
      const falhas = resultados
        .filter((resultado) => resultado.status === "rejected")
        .map((resultado) => resultado.reason?.message)
        .filter(Boolean);
      if (falhas.length) setErro(falhas.join(" "));
    }

    carregarDashboard();

    return () => {
      ativo = false;
    };
  }, [usuario]);

  // Dados formatados para os cards
  const ultimaMedicao = resumo?.ultima_medicao;

  const valorUltimaMedicao =
    ultimaMedicao?.valor != null
      ? `${ultimaMedicao.valor} mg/dL`
      : "Sem medições";

  const dataMedicao = ultimaMedicao?.data_hora
    ? new Date(ultimaMedicao.data_hora).toLocaleDateString("pt-BR")
    : "";

  const horarioMedicao = ultimaMedicao?.data_hora
    ? new Date(ultimaMedicao.data_hora).toLocaleTimeString(
        "pt-BR",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    : "";

  const media =
    resumo?.media != null
      ? `${resumo.media} mg/dL`
      : "Sem dados";

  const semanas = resumo?.qtd_semanas || "Sem dados";
  const dataParto = formatarDataParto(resumo?.data_prev_parto);
  const marcoSemana = resumo?.frase_semana || "Sem dados para esta semana.";

  const proximoLembrete = resumo?.proximos_lembretes?.[0];

  const lembrete = proximoLembrete
    ? `${proximoLembrete.titulo} — ${String(
        proximoLembrete.horario
      ).slice(0, 5)}`
    : null;

  return (
    <div className="min-h-screen flex bg-pink-100">
      <main className="flex-1 min-w-0 p-3 sm:p-3 pt-20 md:pt-3">
        <Header
          titulo={"Olá"}
          component={
            <UserName
              className="text-pink-400 text-3xl sm:text-4xl font-bold"
              nome={usuario?.nome || ""}
            />
          }
          component2={
            <Botao
              className="bg-white rounded-2xl p-3 sm:p-4 font-poppins flex gap-3 justify-center items-center cursor-pointer transition-transform duration-500 hover:scale-105 w-full md:w-80 focus:outline-none shadow-xl"
              imgClassName="w-8 h-8 sm:w-10 sm:h-10"
              textClassName="p-1 font-semibold text-sm sm:text-base"
              imagem="https://cdn-icons-png.flaticon.com/512/337/337946.png"
              desc="Imagem ícone PDF"
              nome={
                gerandoPdf
                  ? "Gerando PDF..."
                  : "Exportar relatório em PDF"
              }
              clickHandler={() => {
                setErroPdf("");
                setMostrarPeriodo(true);
              }}
              tipoDado="button"
            />
          }
        />

        <div className="max-w-6xl mx-auto mt-6 flex flex-col gap-4 sm:gap-6">

          {/* Modal de seleção do período do relatório */}
          {mostrarPeriodo && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-relatorio"
            >
              <form
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                onSubmit={(event) => {
                  event.preventDefault();
                  gerarRelatorio();
                }}
              >
                <h2
                  id="titulo-relatorio"
                  className="mb-4 text-xl font-bold text-pink-500"
                >
                  Período do relatório
                </h2>

                <div className="flex flex-col gap-3">
                  <label className="font-medium">
                    Data inicial

                    <input
                      className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                      type="date"
                      required
                      value={dataInicio}
                      max={dataFim}
                      onChange={(event) =>
                        setDataInicio(event.target.value)
                      }
                    />
                  </label>

                  <label className="font-medium">
                    Data final

                    <input
                      className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                      type="date"
                      required
                      value={dataFim}
                      min={dataInicio}
                      max={dataLocal(new Date())}
                      onChange={(event) =>
                        setDataFim(event.target.value)
                      }
                    />
                  </label>
                </div>

                {erroPdf && (
                  <p
                    role="alert"
                    className="mt-3 text-sm text-rose-700"
                  >
                    {erroPdf}
                  </p>
                )}

                <div className="mt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    className="rounded-full px-4 py-2 text-gray-700"
                    disabled={gerandoPdf}
                    onClick={() => setMostrarPeriodo(false)}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={gerandoPdf}
                    className="rounded-full bg-pink-500 px-5 py-2 font-semibold text-white disabled:opacity-60"
                  >
                    {gerandoPdf ? "Gerando..." : "Baixar PDF"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Linha 1: resumo das medições e gestação */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">

            <CardInfo
              UltimaAfericao={valorUltimaMedicao}
              nivel={classificacaoUltima}
              data={dataMedicao}
              horario={horarioMedicao}
            />

            <CardMedia
              media={media}
              nivel={resumo?.media != null ? "Normal" : "Sem dados"}
            />

            <CardGestacao
              className="lg:col-span-2 xl:col-span-1"
              semanas={semanas}
              dias=""
              trimestre={resumo?.trimestre || ""}
              dataParto={dataParto}
            />

          </div>

          {/* Linha 2: diário alimentar e desenvolvimento do bebê */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

            <CardDiario refeicoes={refeicoes} />

            <CardMarco
              semana={
                resumo?.qtd_semanas
                  ? `${resumo.qtd_semanas}+`
                  : "Sem dados"
              }
              comparacao=""
              descricao={marcoSemana}
            />

          </div>

          {/* Linha 3: lembretes */}
          <div className="max-w-md w-full mx-auto">
            <CardLembrete
              lembrete={lembrete}
              aoCriar={() => {}}
            />
          </div>

          {/* Mensagens de erro */}
          {erro && (
            <p
              role="alert"
              className="text-center text-rose-700"
            >
              {erro}
            </p>
          )}

        </div>
      </main>
    </div>
  );
}

export default Home;
