import Sidebar from "../components/Sidebar";
import UserName from "../components/UserName";
function Home() {
    return (
        <div className="min-h-screen flex ">
            <div className="w-3/10 min-h-screen">
                <Sidebar/>
            </div>
            <div className="w-full bg-pink-100 p-5">
                <main >
                    <header>
                        <div className="flex justify-between items-center m-3 p-1">
                        <UserName className={"text-5xl text-pink-400 font-bold m-2 font-poppins"} nome={"Maria Fonseca"}/>
                        <button className="bg-white rounded-2xl m-2 p-4 font-poppins flex gap-3 justify-center items-center cursor-pointer transition-transform duration-500 hover:scale-105 w-80 focus:outline-none shadow-xl">
                            <img className="w-10 h-10" src="src\assets\Icones\icone-pdf.png" alt="imagem icone pdf"/><p className="p-1 font-semibold">Exportar relatório em PDF</p>
                        </button>
                        </div>
                    </header>
                </main>

            </div>
        </div>
    )
}

export default Home;
