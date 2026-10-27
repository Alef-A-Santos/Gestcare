import Sidebar from "../components/Sidebar";
import UserName from "../components/UserName";
import iconePdf from "../assets/Icones/icone-pdf.png";
import { useEffect, useState } from "react";

function Home() {
    const [usuario, setUsuario] = useState(null);
    const [resumo, setResumo] = useState(null);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);

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
                console.log(dadosResumo)
                if (!respostaResumo.ok) {
                    throw new Error(dadosResumo?.erro || "Não foi possível carregar o resumo do dashboard.");
                }
                if (ativo) setResumo(dadosResumo);
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
        <div className="min-h-screen flex ">
            <div className="w-3/10 min-h-screen">
                <Sidebar nomeUsuario={usuario?.nome} />
            </div>
            <div className="w-full bg-pink-100 p-5">
                <main >
                    <header>
                        <div className="flex justify-between items-center m-3 p-1">
                        <UserName className={"text-5xl text-pink-400 font-bold m-2 font-poppins"} nome={usuario?.nome || (carregando ? "Carregando..." : "Dashboard")}/>
                        <button className="bg-white rounded-2xl m-2 p-4 font-poppins flex gap-3 justify-center items-center cursor-pointer transition-transform duration-500 hover:scale-105 w-80 focus:outline-none shadow-xl">
                            <img className="w-10 h-10" src={iconePdf} alt="Ícone de PDF"/><p className="p-1 font-semibold">Exportar relatório em PDF</p>
                        </button>
                        </div>
                        {usuario?.perfil === "gestante" && resumo && <div className="m-3 flex flex-wrap gap-4 font-poppins text-gray-700">
                            {Object.entries(resumo).flatMap(([chave, valor]) => {
                                if (valor === null || typeof valor === "object") return [];
                                return <p key={chave} className="rounded-xl bg-white px-4 py-3 shadow">
                                    <span className="font-semibold">{chave}: </span>
                                    <span>{String(valor)}</span>
                                </p>;
                            })}
                        </div>}
                        {!carregando && usuario && usuario.perfil !== "gestante" && <p className="m-3 font-poppins text-gray-700">O resumo do dashboard está disponível apenas para gestantes.</p>}
                        {carregando && <p className="m-3 font-poppins text-gray-700">Carregando dados...</p>}
                        {erro && <p role="alert" className="m-3 text-red-700">{erro}</p>}
                    </header>
                </main>

            </div>
        </div>
    )
}

export default Home;
