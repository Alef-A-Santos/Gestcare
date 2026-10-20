import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

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
          <div>
            <h2 className="text-3xl">Ultima medição</h2>
            <h3 className="text-2xl"> 20mg/dl</h3>
            <div>
              <div>
                <p>baixa</p>
              </div>
              
              <p>jejum</p>
            </div>
            <div>
              <p>19/08/2026</p>
              <p>13:49</p>
            </div>
          </div>
          <div></div>
          <div></div>
        </div>
      </main>
    </div>
  );
}

export default Home;
