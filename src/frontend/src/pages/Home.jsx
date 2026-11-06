import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CardInfo from "../components/CardInfo";
import CardMedia from "../components/CardMedia";
import CardGestacao from "../components/CardGestacao";
import CardDiario from "../components/Carddiario";
import CardMarco from "../components/CardMarco";
import CardLembrete from "../components/CardLembrete";
import UserName from "../components/UserName";
import Botao from "../components/Botao";
import { useEffect, useState } from "react";

function Home() {
    const [usuario, setUsuario] = useState(null);
    const [resumo, setResumo] = useState(null);
    const [refeicoes, setRefeicoes] = useState([]);
    const [erro, setErro] = useState("");
    const hoje = new Date();
    const dataLocal = (data) => `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
    const primeiroDiaMes = dataLocal(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
    const [dataInicio, setDataInicio] = useState(primeiroDiaMes);
    const [dataFim, setDataFim] = useState(dataLocal(hoje));
    const [mostrarPeriodo, setMostrarPeriodo] = useState(false);
    const [gerandoPdf, setGerandoPdf] = useState(false);
    const [erroPdf, setErroPdf] = useState("");
    const classificacaoBackend = String(resumo?.ultima_medicao?.classificacao || "").trim();
    const classificacoes = {
      A: "Alta",
      B: "Baixa",
      N: "Normal",
    };
    const codigoClassificacao = classificacaoBackend.toUpperCase();
    const classificacaoUltima = classificacoes[codigoClassificacao]
      || ({ alta: "Alta", baixa: "Baixa", normal: "Normal" }[classificacaoBackend.toLowerCase()])
      || "Sem dados";

    async function gerarRelatorio() {
      setErroPdf("");
      if (!dataInicio || !dataFim || dataInicio > dataFim) {
        setErroPdf("Selecione um periodo valído.");
        return;
      }
      if (dataInicio.slice(0, 4) !== dataFim.slice(0, 4)) {
        setErroPdf("O peri­odo precisa estar dentro do mesmo ano.");
        return;
      }

      setGerandoPdf(true);
      try {
        const resposta = await fetch("http://localhost:3000/api/relatorio/gerar-relatorio", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dados: {
            data_inicio: dataInicio,
            data_fim: dataFim,
            ano: Number(dataInicio.slice(0, 4)),
          } }),
        });

        const tipoResposta = resposta.headers.get("content-type") || "";
        if (tipoResposta.includes("application/json")) {
          const resultado = await resposta.json().catch(() => null);
          if (resultado?.sem_registros) {
            setErroPdf(resultado.mensagem || "Não há dados para gerar o relatório no período selecionado.");
            return;
          }
          if (!resposta.ok) {
            throw new Error(resultado?.erro || "Não foi possível gerar o relatório.");
          }
          throw new Error(resultado?.erro || "Não foi possível gerar o relatório.");
        }

        if (!resposta.ok) {
          throw new Error("Não foi possível gerar o relatório.");
        }

        const pdf = await resposta.blob();
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
        setErroPdf(error.message || "Falha ao conectar com o servidor.");
      } finally {
        setGerandoPdf(false);
      }
    }

    useEffect(() => {
        let ativo = true;

        async function carregarDashboard() {
            try {
                const respostaUsuario = await fetch("http://localhost:3000/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                });

                const dadosUsuario = await respostaUsuario.json().catch(() => null);
                if (!respostaUsuario.ok) {
                    throw new Error(dadosUsuario?.erro || "NÃ£o foi possi­vel carregar os dados do usuÃ¡rio.");
                }

                const usuarioSessao = dadosUsuario?.user ?? null;
                if (ativo) setUsuario(usuarioSessao);

                if (usuarioSessao?.perfil !== "gestante") return;

                if (usuarioSessao?.id) {
                    const agora = new Date();
                    const dataHoje = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")}`;
                    const respostaRefeicoes = await fetch(
                        `http://localhost:3000/api/diario/listar-refeicoes/usuario/${encodeURIComponent(usuarioSessao.id)}?data=${dataHoje}`,
                        { method: "GET", credentials: "include" }
                    );
                    const dadosRefeicoes = await respostaRefeicoes.json().catch(() => null);
                    if (!respostaRefeicoes.ok) {
                        throw new Error(dadosRefeicoes?.erro || "Falha ao carregar diario alimentar.");
                    }
                    if (ativo) setRefeicoes(dadosRefeicoes?.refeicoes ?? []);
                }

                const respostaResumo = await fetch("http://localhost:3000/api/dashboard/resumo", {
                    method: "GET",
                    credentials: "include",
                });
                const dadosResumo = await respostaResumo.json().catch(() => null);
                if (!respostaResumo.ok) {
                    throw new Error(dadosResumo?.erro || "NÃ£o foi possi­vel carregar o resumo do dashboard.");
                }
                if (ativo) setResumo(dadosResumo?.resumo ?? null);
            } catch (error) {
                if (ativo) setErro(error.message || "Falha ao conectar com o servidor.");
            }
        }

        carregarDashboard();
        return () => { ativo = false; };
    }, []);
  return (
    <div className="min-h-screen flex bg-pink-100">
      {/* Sidebar direto, sem <div> em volta, para ela acompanhar a altura da pÃ¡gina */}
      
      <Sidebar
        nome={usuario?.nome}
        semanas={resumo?.qtd_semanas}
        caminhoFoto={usuario?.caminho_foto || usuario?.foto_perfil}
      />

      {/* min-w-0 evita que os cards estourem a largura; pt-20 libera espaÃ§o pro botÃ£o do menu no mobile */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 pt-20 md:pt-6">
        <Header
          titulo={"Olá  "}
          component={
          <UserName
              className={"text-pink-400 text-3xl sm:text-4xl font-bold"}
              nome={usuario?.nome || ""}
            />
          }
          component2={
            <Botao
              className="bg-white rounded-2xl p-3 sm:p-4 font-poppins flex gap-3 justify-center items-center cursor-pointer transition-transform duration-500 hover:scale-105 w-full md:w-80 focus:outline-none shadow-xl"
              imgClassName="w-8 h-8 sm:w-10 sm:h-10"
              textClassName="p-1 font-semibold text-sm sm:text-base"
              imagem="https://cdn-icons-png.flaticon.com/512/337/337946.png"
              desc="imagem icone pdf"
              nome={gerandoPdf ? "Gerando PDF..." : "Exportar relatório em PDF"}
              clickHandler={() => { setErroPdf(""); setMostrarPeriodo(true); }}
              tipoDado="button"
            />
          }
        />

        <div className="max-w-6xl mx-auto mt-6 flex flex-col gap-4 sm:gap-6">
          {mostrarPeriodo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="titulo-relatorio">
              <form className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onSubmit={(event) => { event.preventDefault(); gerarRelatorio(); }}>
                <h2 id="titulo-relatorio" className="mb-4 text-xl font-bold text-pink-500">Peri­odo do relatório</h2>
                <div className="flex flex-col gap-3">
                  <label className="font-medium">Data inicial
                    <input className="mt-1 w-full rounded-lg border border-gray-300 p-2" type="date" required value={dataInicio} onChange={(event) => setDataInicio(event.target.value)} />
                  </label>
                  <label className="font-medium">Data final
                    <input className="mt-1 w-full rounded-lg border border-gray-300 p-2" type="date" required value={dataFim} onChange={(event) => setDataFim(event.target.value)} />
                  </label>
                </div>
                {erroPdf && <p role="alert" className="mt-3 text-sm text-rose-700">{erroPdf}</p>}
                <div className="mt-5 flex justify-end gap-3">
                  <button type="button" className="rounded-full px-4 py-2 text-gray-700" disabled={gerandoPdf} onClick={() => setMostrarPeriodo(false)}>Cancelar</button>
                  <button type="submit" disabled={gerandoPdf} className="rounded-full bg-pink-500 px-5 py-2 font-semibold text-white disabled:opacity-60">{gerandoPdf ? "Gerando..." : "Baixar PDF"}</button>
                </div>
              </form>
            </div>
          )}
          {/* Linha 1: resumo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <CardInfo
              UltimaAfericao={resumo?.ultima_medicao?.valor != null ? `${resumo.ultima_medicao.valor} mg/dL` : "Sem mediçõess"}
              nivel={classificacaoUltima}
              data={resumo?.ultima_medicao?.data_hora ? new Date(resumo.ultima_medicao.data_hora).toLocaleDateString("pt-BR") : ""}
              horario={resumo?.ultima_medicao?.data_hora ? new Date(resumo.ultima_medicao.data_hora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : ""}
            />
            <CardMedia
              media={resumo?.media != null ? `${resumo.media} mg/dL` : "Sem dados"}
              nivel={resumo?.media != null ? "Normal" : "Sem dados"}
            />
            <CardGestacao
              className="lg:col-span-2 xl:col-span-1"
              semanas={resumo?.qtd_semanas || "Sem dados de gestação"}
              dias=""
              trimestre=""
              dataParto=""
            />
          </div>

          {/* Linha 2: diario e marco */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <CardDiario refeicoes={refeicoes} />
            <CardMarco
              semana="20+"
              comparacao="Do tamanho de um mamÃ£o papaya"
              descricao="ouvidos atentos a sua voz e movimentos cheios de energia."
            />
          </div>

          {/* Linha 3: lembrete */}
          <div className="max-w-md w-full mx-auto">
            <CardLembrete
              lembrete={resumo?.proximos_lembretes?.[0]
                ? `${resumo.proximos_lembretes[0].titulo} â€” ${String(resumo.proximos_lembretes[0].horario).slice(0, 5)}`
                : null}
              aoCriar={() => {}}
            />
          </div>
          {erro && <p role="alert" className="text-center text-rose-700">{erro}</p>}
        </div>
      </main>
    </div>
  );
}

export default Home;
