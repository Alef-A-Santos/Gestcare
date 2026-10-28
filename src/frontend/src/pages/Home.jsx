import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CardInfo from "../components/CardInfo";
import CardMedia from "../components/CardMedia";
import CardGestacao from "../components/CardGestacao";
import CardDiario from "../components/CardDiario";
import CardMarco from "../components/CardMarco";
import CardLembrete from "../components/CardLembrete";
 
const refeicoes = [
  "Café da manhã",
  "Lanche da manhã",
  "Almoço",
  "Lanche da tarde",
  "Jantar",
  "Ceia",
];
 
function Home() {
  return (
    <div className="min-h-screen flex bg-pink-100">
      {/* Sidebar direto, sem <div> em volta, para ela acompanhar a altura da página */}
      <Sidebar />
 
      {/* min-w-0 evita que os cards estourem a largura; pt-20 libera espaço pro botão do menu no mobile */}
      <main className="flex-1 min-w-0 p-6 pt-20 md:pt-6">
        <Header />
 
        <div className="max-w-6xl mx-auto mt-6 flex flex-col gap-6">
          {/* Linha 1: resumo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <CardInfo
              UltimaAfericao="20 mg/dl"
              nivel="Baixa"
              estado="jejum"
              data="19/08/2026"
              horario="13:49"
            />
            <CardMedia media="85 mg/dl" nivel="Normal" />
            <CardGestacao
              className="lg:col-span-2 xl:col-span-1"
              semanas={22}
              dias={0}
              trimestre={2}
              dataParto="22/12/2026"
            />
          </div>
 
          {/* Linha 2: diário e marco */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardDiario refeicoes={refeicoes} />
            <CardMarco
              semana="20+"
              comparacao="Do tamanho de um mamão papaya"
              descricao="ouvidos atentos à sua voz e movimentos cheios de energia."
            />
          </div>
 
          {/* Linha 3: lembrete */}
          <div className="max-w-md w-full mx-auto">
            <CardLembrete lembrete={null} aoCriar={() => {}} />
          </div>
        </div>
      </main>
    </div>
  );
}
 
export default Home;