import { FiPhoneCall, FiAlertTriangle } from "react-icons/fi";
import Header from "../components/Header";
import Botao from "../components/Botao";
import UserName from "../components/UserName";
import CardNumero from "../components/CardNumero";

// Troque pelos dados reais da API (Acompanhantes) quando a tela estiver conectada.
const numerosEmergencia = [
  {
    numero: "192",
    titulo: "SAMU",
    descricao: "Pronto socorro 24hrs por dia",
    destaque: true,
  },
  {
    numero: "193",
    titulo: "Bombeiros",
    descricao: "Incêndios, resgates e afogamentos.",
  },
  {
    numero: "190",
    titulo: "Polícia Militar",
    descricao: "Quando há risco à sua segurança.",
  },
  {
    numero: "136",
    titulo: "Disque Saúde",
    descricao: "Orientações do Ministério da Saúde.",
  },
  {
    numero: "180",
    titulo: "Central da Mulher",
    descricao: "Denúncia e apoio em casos de violência.",
  },
  {
    numero: "188",
    titulo: "CVV",
    descricao: "Apoio emocional gratuito, 24 horas.",
  },
];

const acompanhantes = [
  {
    id: 1,
    nome: "Maria Souza",
    parentesco: "Mãe",
    telefone: "(19) 99999-0001",
  },
  {
    id: 2,
    nome: "João Santos",
    parentesco: "Companheiro",
    telefone: "(19) 99999-0002",
  },
];

const sinaisDeAlerta = [
  "Tremores, suor frio, tontura ou confusão (possível hipoglicemia)",
  "Sede intensa, muita urina e glicemia muito acima do seu limite",
  "Sangramento, perda de líquido ou contrações regulares",
  "Bebê se mexendo bem menos do que o habitual",
];

function NumeroEmergencia() {
  const ligar = (telefone) => {
    window.location.assign(`tel:${telefone.replace(/\D/g, "")}`);
  };

  const iniciais = (nome) =>
    nome
      .split(" ")
      .map((parte) => parte[0])
      .slice(0, 2)
      .join("");

  return (
    <section className="font-[Poppins] w-full max-w-5xl mx-auto px-4 pb-10 text-teal-800">
      <Header
        titulo="Números de Emergência"
        component={
          <FiPhoneCall className="text-pink-400 text-5xl" aria-hidden="true" />
        }
      />

      {/* Números oficiais */}
      <div className="grid gap-4 md:grid-cols-3">
        {numerosEmergencia.map((item) => (
          <CardNumero key={item.numero} {...item} aoLigar={ligar} />
        ))}
      </div>

      {/* Sinais de alerta + acompanhantes */}
      <div className="grid gap-6 mt-8 md:grid-cols-2">
        <div className="rounded-2xl bg-pink-50 border-l-4 border-pink-400 p-6">
          <h3 className="font-playfair text-2xl font-semibold text-pink-500 flex items-center gap-2">
            <FiAlertTriangle aria-hidden="true" />
            Procure atendimento agora se sentir
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-teal-800 list-disc pl-5 text-[15px]">
            {sinaisDeAlerta.map((sinal) => (
              <li key={sinal}>{sinal}</li>
            ))}
          </ul>
          <p className="text-xs text-teal-700/80 mt-4 text-[18px]">
            {" "}
            Esta lista não substitui a orientação da sua equipe de saúde.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-teal-100 p-6">
          <h3 className="font-[Playfair_Display] text-3xl font-semibold text-teal-700">
            Seus acompanhantes
          </h3>

          <ul className="mt-4 divide-y divide-teal-100">
            {acompanhantes.map((pessoa) => (
              <li
                key={pessoa.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-11 h-11 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold"
                    aria-hidden="true"
                  >
                    {iniciais(pessoa.nome)}
                  </span>
                  <div>
                    <UserName
                      nome={pessoa.nome}
                      className="font-semibold text-teal-800 text-[18px]"
                    />
                    <p className="text-xs text-teal-700/80 text-[15px]">
                      {pessoa.parentesco} • {pessoa.telefone}
                    </p>
                  </div>
                </div>

                <Botao
                  nome="Ligar"
                  tipoDado="button"
                  clickHandler={() => ligar(pessoa.telefone)}
                  className="rounded-full bg-pink-400 text-white text-sm text-[15px] font-medium px-5 py-2 cursor-pointer hover:bg-pink-500 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-200"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default NumeroEmergencia;
