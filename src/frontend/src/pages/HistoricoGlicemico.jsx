import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
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
    <>
      <Header
        titulo="Histórico glicêmico "
        component2={
          <button
            type="button"
            className="bg-teal-600 text-white rounded-2xl text-[18px] font-semibold p-5 sm:p-4 font-poppins flex gap-3 justify-center items-center cursor-pointer transition-transform duration-500 hover:scale-105 w-full md:w-80 focus:outline-none shadow-xl"
          >
            <FiPlus size={22} aria-hidden="true" />
            Registrar glicemia
          </button>
        }
      />

      <Card
        titulo="Registros"
        className="mt-6 sm:mt-10 max-w-3xl mx-auto min-h-72 text-base sm:text-[18px]"
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
    </>
  );
}

export default HistoricoGlicemico;