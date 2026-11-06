
import {
  IoHomeOutline,
  IoMenu,
  IoClose,
  IoLogOutOutline,
  IoPerson,
} from "react-icons/io5";

import { VscSettingsCompact } from "react-icons/vsc";
import { LuSalad, LuNotebookPen } from "react-icons/lu";
import { FaRegBell } from "react-icons/fa";
import { BsTelephone } from "react-icons/bs";
import { useState, useEffect } from "react";

import UserName from "./UserName";
import SidebarItens from "./SidebarItens";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Ajuste os caminhos (to) para os mesmos do seu App.jsx
const itens = [
  { rotulo: "Início", icone: IoHomeOutline, to: "/home" },
  { rotulo: "Histórico Glicêmico", icone: VscSettingsCompact, to: "/historico" },
  { rotulo: "Diário Alimentar", icone: LuSalad, to: "/diario" },
  { rotulo: "Lembretes", icone: FaRegBell, to: "/lembretes" },
  { rotulo: "Números de Emergência", icone: BsTelephone, to: "/emergencia" },
  { rotulo: "Dicas Educativas", icone: LuNotebookPen, to: "/dicas" },
];

function Sidebar({
  nome = "Maria Fonseca",
  semanas,
  caminhoFoto,
}) {
  const navigate = useNavigate();

  const [fotoEnviada, setFotoEnviada] = useState(null);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

  // Formatar semanas de gestação
  const gestacaoFormatada = (() => {
    if (semanas == null || semanas === "") return null;

    const valor = String(semanas).trim();

    const totalDias = valor.match(/(\d+)\s*dias?/i);

    if (totalDias) {
      const dias = Number(totalDias[1]);
      const semanasCompletas = Math.floor(dias / 7);
      const diasRestantes = dias % 7;

      return `${semanasCompletas} semanas e ${diasRestantes} dias`;
    }

    const numeroSemanas = valor.match(/\d+/);

    return numeroSemanas
      ? `${Number(numeroSemanas[0])} semanas`
      : valor;
  })();

  // Abre no desktop e fecha no mobile quando a tela muda de tamanho
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");

    const aoMudar = (e) => setIsOpen(e.matches);

    mq.addEventListener("change", aoMudar);

    return () => mq.removeEventListener("change", aoMudar);
  }, []);

  // URL da foto de perfil
  const foto =
    fotoEnviada ||
    (caminhoFoto
      ? `http://localhost:3000/api/usuarios/buscar-foto?url=${encodeURIComponent(caminhoFoto)}`
      : null);

  // Enviar foto de perfil
  const enviarFoto = async (event) => {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      Swal.fire({
        title: "Arquivo inválido",
        text: "Selecione uma imagem para o perfil.",
        icon: "warning",
        confirmButtonColor: "#14b8a6",
      });

      event.target.value = "";
      return;
    }

    const formData = new FormData();

    formData.append("foto_perfil", arquivo);

    setEnviandoFoto(true);

    try {
      const resposta = await fetch(
        "http://localhost:3000/api/usuarios/upload-foto",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const dados = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        throw new Error(
          dados?.erro || "Não foi possível enviar a foto."
        );
      }

      if (!dados?.caminho_foto) {
        throw new Error(
          "O servidor não retornou o caminho da foto."
        );
      }

      const urlFoto = `http://localhost:3000/api/usuarios/buscar-foto?url=${encodeURIComponent(dados.caminho_foto)}`;

      setFotoEnviada(`${urlFoto}&t=${Date.now()}`);

      Swal.fire({
        title: "Foto atualizada!",
        text: "Sua foto de perfil foi alterada com sucesso.",
        icon: "success",
        confirmButtonColor: "#14b8a6",
      });

    } catch (error) {
      Swal.fire({
        title: "Erro ao enviar foto",
        text: error.message || "Tente novamente.",
        icon: "error",
        confirmButtonColor: "#14b8a6",
      });

    } finally {
      setEnviandoFoto(false);
      event.target.value = "";
    }
  };

  // Abrir ou fechar o menu
  const toggleSidebar = () => setIsOpen(!isOpen);

  // No mobile, fecha o menu depois de escolher uma página
  const fecharNoMobile = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  // Encerrar sessão
  const handleLogout = async () => {
    const confirmacao = await Swal.fire({
      title: "Deseja sair?",
      text: "Tem certeza de que deseja encerrar sua sessão?",
      icon: "question",
      iconColor: "#14b8a6",
      showCancelButton: true,
      confirmButtonText: "Sim, sair",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#14b8a6",
      cancelButtonColor: "#f9a8d4",
      reverseButtons: true,
    });

    if (!confirmacao.isConfirmed) return;

    try {
      const resposta = await fetch(
        "http://localhost:3000/api/auth/logout",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!resposta.ok) {
        throw new Error("Não foi possível encerrar a sessão.");
      }

      // Cookies HttpOnly são removidos pelo servidor na rota de logout.
      // Limpa também os cookies acessíveis pelo JavaScript.
      // document.cookie.split(";").forEach((cookie) => {
      //   const nome = cookie.split("=")[0].trim();
      //   if (nome) {
      //     document.cookie = `${nome}=; Max-Age=0; path=/; SameSite=Lax`;
      //   }
      // });

      navigate("/login", { replace: true });

    } catch (error) {
      Swal.fire({
        title: "Não foi possível sair",
        text: error.message || "Tente novamente.",
        icon: "error",
        confirmButtonText: "Entendi",
        confirmButtonColor: "#14b8a6",
      });
    }
  };

  return (
    <div className="shrink-0">

      {/* Botão de abrir no mobile quando estiver fechado */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-3 bg-teal-500 text-white rounded-xl shadow-lg md:hidden hover:bg-teal-600"
          aria-label="Abrir Menu"
        >
          <IoMenu size={26} />
        </button>
      )}

      {/* Fundo escuro no mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* Menu lateral */}
      <aside
        className={`bg-teal-500 p-4 flex flex-col h-screen overflow-y-auto text-white transition-all duration-300 z-40 fixed top-0 left-0 md:sticky ${
          isOpen
            ? "w-96 lg:w-96 max-w-[85vw] translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-20"
        }`}
      >

        {/* Botão de expandir/recolher */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-teal-600 transition cursor-pointer"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? (
              <IoClose size={30} />
            ) : (
              <IoMenu size={30} />
            )}
          </button>
        </div>

        {/* Perfil e boas-vindas */}
        {isOpen && (
          <div className="flex flex-col items-center justify-center gap-2 mb-6">

            <label className="rounded-full w-24 h-24 bg-white overflow-hidden cursor-pointer flex items-center justify-center border-4 border-pink-300 shadow">

              {foto ? (
                <img
                  src={foto}
                  alt="Perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <IoPerson className="text-5xl text-zinc-400" />
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={enviarFoto}
                disabled={enviandoFoto}
              />

            </label>

            <UserName
              className="text-2xl font-playfair font-bold text-center mt-3"
              nome={nome}
            />

            <h4 className="text-xl mt-2 text-center font-poppins">
              Sua Gestação:{" "}

              {gestacaoFormatada && (
                <span className="font-bold">
                  {gestacaoFormatada}
                </span>
              )}
            </h4>

            <hr className="w-3/4 border-white/40 mt-2" />

          </div>
        )}

        {/* Lista de itens do menu */}
        <nav className="flex-1 flex flex-col gap-5">

          {itens.map((item) => (
            <SidebarItens
              key={item.to}
              {...item}
              aberto={isOpen}
              aoClicar={fecharNoMobile}
            />
          ))}

        </nav>

        {/* Botão sair no rodapé */}
        <div className="mt-auto pt-4">
          <button
            type="button"
            title="Sair"
            onClick={handleLogout}
            className="w-full flex justify-center items-center gap-2 p-3 mb-4 rounded-2xl text-xl font-bold font-poppins text-white bg-pink-300 hover:scale-102 transition cursor-pointer"
          >
            {isOpen ? (
              "Sair"
            ) : (
              <IoLogOutOutline size={26} />
            )}
          </button>
        </div>

      </aside>
    </div>
  );
}

export default Sidebar;
