import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

function LayoutPrincipal() {
  const [tema, setTema] = useState(() => localStorage.getItem("temaGestcare") || "light");
  const [sistemaEscuro, setSistemaEscuro] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const atualizar = (evento) => setSistemaEscuro(evento.matches);
    media.addEventListener("change", atualizar);
    return () => media.removeEventListener("change", atualizar);
  }, []);

  const escuro = tema === "dark" || (tema === "system" && sistemaEscuro);
  const trocarTema = (novoTema) => {
    setTema(novoTema);
    localStorage.setItem("temaGestcare", novoTema);
  };

  return (
    <div className={`layout-principal min-h-screen flex bg-pink-100 ${escuro ? "tema-escuro" : ""}`}>
      {/* Sidebar direto, sem <div> em volta, para acompanhar a altura da página */}
      <Sidebar tema={tema} aoTrocarTema={trocarTema} />

      <main className="flex-1 min-w-0 p-4 sm:p-6 pt-20 md:pt-6">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutPrincipal;
