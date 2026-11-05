import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Card from "../components/Card";
import Tabela from "../components/Tabela";
import StatusBadge from "../components/StatusBadge";
import BotaoIcone from "../components/BotaoIcone";
import { classificarGlicemia, formatarDataHora } from "../utils/glicemia";

// Dados de exemplo — depois troque pela chamada à API.
const REGISTROS_INICIAIS = [
  { id: 1, dataHora: "2026-08-18T17:33", momento: "Jejum", valor: 85 },
  { id: 2, dataHora: "2026-08-19T13:47", momento: "Pós prandial", valor: 150 },
  { id: 3, dataHora: "2026-08-20T10:20", momento: "Jejum", valor: 20 },
];

const COLUNAS = [
  { chave: "dataHora", titulo: "Data", render: (r) => formatarDataHora(r.dataHora) },
  { chave: "momento", titulo: "Momento" },
  { chave: "valor", titulo: "Valor", render: (r) => `${r.valor} mg/dL` },
  {
    chave: "status",
    titulo: "Status",
    render: (r) => <StatusBadge status={classificarGlicemia(r.valor, r.momento)} />,
  },
];

function HistoricoGlicemico() {
  const [registros, setRegistros] = useState(REGISTROS_INICIAIS);

  function excluir(id) {
    setRegistros((atual) => atual.filter((r) => r.id !== id));
  }

  return (
    <div className="min-h-screen flex bg-pink-100">
      <Sidebar />
      <main className="flex-1 min-w-0 p-4 sm:p-6 pt-20 md:pt-6">
        <Header
          titulo="Histórico glicêmico "
          component2={
            <button
              type="button"
              className="w-full md:w-auto justify-center bg-teal-600 text-white font-poppins font-semibold rounded-2xl px-5 py-3 flex items-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-800 shadow-lg"
            >
              <FiPlus size={20} aria-hidden="true" />
              Registrar glicemia
            </button>
          }
        />

        <Card
          titulo="Registros"
          className="mt-6 sm:mt-20 max-w-3xl mx-auto min-h-72 text-base sm:text-[18px]"
        >
          <Tabela
            colunas={COLUNAS}
            dados={registros}
            mensagemVazia="Você ainda não registrou nenhuma glicemia."
            acoes={(r) => (
              <BotaoIcone
                icone={<FiTrash2 size={22} />}
                rotulo={`Excluir registro de ${formatarDataHora(r.dataHora)}`}
                onClick={() => excluir(r.id)}
              />
            )}
          />
        </Card>
      </main>
    </div>
  );
}

export default HistoricoGlicemico;