import Header from "../components/Header";
import CardInfo from "../components/CardInfo";
import CardMedia from "../components/CardMedia";
import CardGestacao from "../components/CardGestacao";
import CardDiario from "../components/CardDiario";
import CardMarco from "../components/CardMarco";
import CardLembrete from "../components/CardLembrete";
import UserName from "../components/UserName";
import Botao from "../components/Botao";

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
    <>
      <Header
        titulo={"Olá"}
        component={
          <UserName
            className={"text-pink-400 text-4xl sm:text-4xl font-bold"}
            nome={"Maria Fonseca"}
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
          <CardLembrete lembrete={null} aoCriar={() => {}} />
        </div>
      </div>
    </>
  );
}

export default Home;