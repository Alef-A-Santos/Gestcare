import Botao from "../components/Botao";
import Header from "../components/Header";

const refeicoes = [
  {
    id: 1,
    nome: "Café da manhã",
    descricao: "Pão integral com queijo branco + 1 copo de leite ou bebida vegetal",
  },
  {
    id: 2,
    nome: "Lanche da manhã",
    descricao: "1 maçã + 3 castanhas-do-pará",
  },
  {
    id: 3,
    nome: "Almoço",
    descricao: "Arroz integral, feijão, frango grelhado e salada verde com cenoura",
  },
  {
    id: 4,
    nome: "Lanche da tarde",
    descricao: "Arroz integral, feijão, frango grelhado e salada verde com cenoura",
  },
  {
    id: 5,
    nome: "Jantar",
    descricao: "Omelete com legumes (espinafre e tomate) + salada de folhas",
  },
];

function DiarioAlimentar() {
  const verHistorico = () => {
    // TODO: navegar para o histórico completo
  };

  const adicionarRefeicao = () => {
    // TODO: abrir formulário de nova refeição
  };

  return (
    <>
      <Header
        titulo={"Diário Alimentar"}
        component2={
          <div className="flex flex-wrap items-center gap-4">
            <Botao
              nome="Ver histórico completo"
              tipoDado="button"
              clickHandler={verHistorico}
              className="bg-teal-600 text-white rounded-2xl text-[18px] font-semibold p-5 sm:p-4 font-poppins flex gap-3 justify-center items-center cursor-pointer transition-transform duration-500 hover:scale-105 w-full md:w-80 focus:outline-none shadow-xl"
            />
            <Botao
              nome="+ Adicionar refeição"
              tipoDado="button"
              clickHandler={adicionarRefeicao}
              className="bg-teal-600 text-white rounded-2xl text-[18px] font-semibold p-5 sm:p-4 font-poppins flex gap-3 justify-center items-center cursor-pointer transition-transform duration-500 hover:scale-105 w-full md:w-80 focus:outline-none shadow-xl"
            />
          </div>
        }
      />

      <section className="flex justify-center items-start w-full py-6">
        <div className="w-full max-w-xl md:max-w-3xl xl:max-w-4xl bg-gray-100 border border-gray-700 rounded-3xl px-6 py-5 sm:px-10 lg:px-14 mt-8">
          <h3 className="font-poppins text-pink-400 text-4xl sm:text-4xl text-center font-semibold mb-6">
            Refeições registrada
          </h3>

          <ul className="flex flex-col">
            {refeicoes.map((refeicao) => (
              <li
                key={refeicao.id}
                className="py-3 border-b border-pink-300 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-pink-400"
                  />
                  <div className="font-poppins">
                    <h4 className="text-pink-400 text-lg font-semibold mb-1">{refeicao.nome}</h4>
                    <p className="text-black text-sm sm:text-base lg:text-lg mb-1">
                      {refeicao.descricao}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default DiarioAlimentar;