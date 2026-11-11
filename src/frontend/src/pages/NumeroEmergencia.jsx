import { FiPhoneCall, FiAlertTriangle } from "react-icons/fi";
import Header from "../components/Header";
//import Botao from "../components/Botao";
//import UserName from "../components/UserName";
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
      <div className="flex gap-6 mt-8 justify-center items-center">
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
      </div>
    </section>
  );
}

export default NumeroEmergencia;
