import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import Header from "../components/Header";
import Card from "../components/Card";
import Tabela from "../components/Tabela";
import { useUsuario } from "../context/UsuarioContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function formatarDataHora(valor) {
  if (!valor) return "";
  const texto = String(valor).replace(" ", "T");
  const data = new Date(texto);
  return Number.isNaN(data.getTime())
    ? valor
    : data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function dataHoraLocalAtual() {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

async function lerResposta(resposta) {
  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new Error(dados?.erro || dados?.mensagem || "Não foi possível concluir a operação.");
  }
  return dados;
}

function HistoricoGlicemico() {
  const usuario = useUsuario();
  const idUsuario = usuario?.id_usuario;
  const [registros, setRegistros] = useState([]);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [valor, setValor] = useState("");
  const [dataHora, setDataHora] = useState(dataHoraLocalAtual);
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarRegistros = useCallback(async () => {
    if (!idUsuario) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro("");
    try {
      const resposta = await fetch(`${API}/glicemia/listar-glicemia`, { credentials: "include" });
      const dados = await lerResposta(resposta);
      setRegistros((dados?.glicemias || []).map((item) => ({
        ...item,
        id: item.id_glicemia,
        dataHora: formatarDataHora(item.data_hora),
      })));
    } catch (error) {
      setErro(error.message || "Falha ao carregar os registros.");
    } finally {
      setCarregando(false);
    }
  }, [idUsuario]);

  useEffect(() => { carregarRegistros(); }, [carregarRegistros]);

  const colunas = [
    { chave: "dataHora", titulo: "Data" },
    { chave: "valor", titulo: "Valor", render: (registro) => `${registro.valor} mg/dL` },
  ];

  function abrirFormulario() {
    setValor("");
    setDataHora(dataHoraLocalAtual());
    setErro("");
    setFormularioAberto(true);
  }

  async function registrarGlicemia(event) {
    event.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      const resposta = await fetch(`${API}/glicemia/cadastrar-glicemia`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dados: { valor: Number(valor), data_hora: dataHora } }),
      });
      await lerResposta(resposta);
      setFormularioAberto(false);
      await carregarRegistros();
    } catch (error) {
      setErro(error.message || "Falha ao registrar a glicemia.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirGlicemia(registro) {
    setErro("");
    try {
      const resposta = await fetch(`${API}/glicemia/remover-glicemia/${encodeURIComponent(registro.id_glicemia)}`, {
        method: "DELETE",
        credentials: "include",
      });
      await lerResposta(resposta);
      setRegistros((atuais) => atuais.filter((item) => item.id_glicemia !== registro.id_glicemia));
    } catch (error) {
      setErro(error.message || "Falha ao excluir a glicemia.");
    }
  }

  return (
    <>
      <Header
        titulo="Histórico glicêmico"
        component2={
          <button type="button" onClick={abrirFormulario} className="bg-teal-600 text-white rounded-2xl text-[18px] font-semibold p-5 sm:p-4 font-poppins flex gap-3 justify-center items-center cursor-pointer transition-transform duration-500 hover:scale-105 w-full md:w-80 focus:outline-none shadow-xl">
            <FiPlus size={22} aria-hidden="true" /> Registrar glicemia
          </button>
        }
      />

      <Card titulo="Registros" className="mt-6 sm:mt-10 max-w-3xl mx-auto min-h-72 text-base sm:text-[18px]">
        {erro && !formularioAberto && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-center text-red-700">{erro}</p>}
        {formularioAberto && (
          <form onSubmit={registrarGlicemia} className="mb-7 rounded-2xl border border-teal-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-teal-800">Nova glicemia</h3>
              <button type="button" aria-label="Fechar formulário" onClick={() => setFormularioAberto(false)} className="rounded p-2 text-gray-600 hover:bg-gray-100"><FiX /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 font-medium text-gray-700">
                Valor (mg/dL)
                <input required type="number" min="1" max="1000" step="any" value={valor} onChange={(event) => setValor(event.target.value)} className="rounded-lg border border-gray-300 p-3" placeholder="Ex.: 95" />
              </label>
              <label className="flex flex-col gap-1 font-medium text-gray-700">
                Data e horário
                <input required type="datetime-local" value={dataHora} onChange={(event) => setDataHora(event.target.value)} className="rounded-lg border border-gray-300 p-3" />
              </label>
            </div>
            {erro && <p role="alert" className="mt-3 text-sm text-red-700">{erro}</p>}
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setFormularioAberto(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700">Cancelar</button>
              <button disabled={salvando} type="submit" className="rounded-lg bg-teal-600 px-5 py-2 font-semibold text-white hover:bg-teal-700 disabled:opacity-60">{salvando ? "Salvando..." : "Salvar glicemia"}</button>
            </div>
          </form>
        )}
        {carregando ? (
          <p className="py-8 text-center text-gray-600">Carregando registros...</p>
        ) : erro && registros.length === 0 ? null : (
          <Tabela
            colunas={colunas}
            dados={registros}
            mensagemVazia="Registre uma glicemia para ela aparecer nesta lista."
            acoes={(registro) => (
              <button type="button" onClick={() => excluirGlicemia(registro)} aria-label={`Excluir glicemia de ${registro.dataHora}`} className="rounded-lg p-2 text-red-700 hover:bg-red-50">
                <FiTrash2 aria-hidden="true" />
              </button>
            )}
          />
        )}
      </Card>
    </>
  );
}

export default HistoricoGlicemico;
