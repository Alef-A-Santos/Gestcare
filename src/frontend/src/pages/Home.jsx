import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CardInfo from "../components/CardInfo";

function Home() {
  return (
    <div className="min-h-screen flex bg-pink-100">
      {/* O Sidebar gerencia a própria largura */}
      <div>
        <Sidebar />
      </div>
      {/* Conteúdo Principal expande para preencher o resto */}
      <main className="flex-1 p-6">
        <Header />
        <div className="flex">
          <CardInfo
            UltimaAfericao={"20mg/dl"}
            className={
              "text-2xl rounded-full bg-amber-200 text-zinc-400 py-1 px-4 font-poppins"
            }
            nivel={"Baixa"}
            estado={"jejum"}
            data={"19/08/2026"}
            horario={"13:49"}
          />
          
        </div>
      </main>
    </div>
  );
}

export default Home;
