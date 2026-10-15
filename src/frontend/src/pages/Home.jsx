import Sidebar from "../components/Sidebar";

function Home() {
  return (
    <div className="min-h-screen flex bg-pink-100">
      {/* O Sidebar gerencia a própria largura */}
      <Sidebar />

      {/* Conteúdo Principal expande para preencher o resto */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800">Painel Principal</h1>
      </main>
    </div>
  );
}

export default Home;