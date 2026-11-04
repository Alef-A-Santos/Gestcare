import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CardInfo from "../components/CardInfo";
import CardMedia from "../components/CardMedia";
import CardGestacao from "../components/CardGestacao";
import CardDiario from "../components/CardDiario";
import CardMarco from "../components/CardMarco";
import CardLembrete from "../components/CardLembrete";
import UserName from "../components/UserName";
import Botao from "../components/Botao";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const refeicoes = [
  "Café da manhã",
  "Lanche da manhã",
  "Almoço",
  "Lanche da tarde",
  "Jantar",
  "Ceia",
];

function Home() {
    const [usuario, setUsuario] = useState(null);
    const [resumo, setResumo] = useState(null);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);
    const classificacaoUltima = {
      alta: "Alta",
      baixa: "Baixa",
      normal: "Normal",
    }[String(resumo?.ultima_medicao?.classificacao || "").toLowerCase()] || "Sem dados";

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
                    throw new Error(dadosUsuario?.erro || "Não foi possível carregar os dados do usuário.");
                }

                const usuarioSessao = dadosUsuario?.user ?? null;
                if (ativo) setUsuario(usuarioSessao);

                if (usuarioSessao?.perfil !== "gestante") return;

                const respostaResumo = await fetch("http://localhost:3000/api/dashboard/resumo", {
                    method: "GET",
                    credentials: "include",
                });
                const dadosResumo = await respostaResumo.json().catch(() => null);
                if (!respostaResumo.ok) {
                    throw new Error(dadosResumo?.erro || "Não foi possível carregar o resumo do dashboard.");
                }
                if (ativo) setResumo(dadosResumo?.resumo ?? null);
            } catch (error) {
                if (ativo) setErro(error.message || "Falha ao conectar com o servidor.");
            } finally {
                if (ativo) setCarregando(false);
            }
        }

        carregarDashboard();
        return () => { ativo = false; };
    }, []);
  return (
    <div className="min-h-screen flex bg-pink-100">
      {/* Sidebar direto, sem <div> em volta, para ela acompanhar a altura da página */}
      
      <Sidebar nome={usuario?.nome}/>

      {/* min-w-0 evita que os cards estourem a largura; pt-20 libera espaço pro botão do menu no mobile */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 pt-20 md:pt-6">
        <Header
          titulo={"Olá"}
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
              nome="Exportar relatório em PDF"
            />
          }
        />

        <div className="max-w-6xl mx-auto mt-6 flex flex-col gap-4 sm:gap-6">
          {/* Linha 1: resumo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <CardInfo
              UltimaAfericao={resumo?.ultima_medicao?.valor != null ? `${resumo.ultima_medicao.valor} mg/dL` : "Sem medições"}
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

          {/* Linha 2: diário e marco */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <CardDiario refeicoes={refeicoes} />
            <CardMarco
              semana="20+"
              comparacao="Do tamanho de um mamão papaya"
              descricao="ouvidos atentos à sua voz e movimentos cheios de energia."
            />
          </div>

          {/* Linha 3: lembrete */}
          <div className="max-w-md w-full mx-auto">
            <CardLembrete
              lembrete={resumo?.proximos_lembretes?.[0]
                ? `${resumo.proximos_lembretes[0].titulo} — ${String(resumo.proximos_lembretes[0].horario).slice(0, 5)}`
                : null}
              aoCriar={() => {}}
            />
          </div>
          {erro && <p role="alert" className="text-center text-rose-700">{erro}</p>}
          {!carregando && !resumo?.ultima_medicao && (
            <Link to="/historico" className="mx-auto rounded-full bg-teal-600 px-6 py-3 font-semibold text-white shadow hover:bg-teal-700">
              Registrar primeira glicemia
            </Link>
          )}
          {!carregando && !resumo?.qtd_semanas && (
            <Link to="/Cadastro" className="mx-auto rounded-full bg-pink-400 px-6 py-3 font-semibold text-white shadow hover:bg-pink-500">
              Cadastrar dados da gestação
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
