import { useState } from "react";
import { FiBookOpen, FiAlertCircle, FiChevronDown, FiMoon, FiCalendar } from "react-icons/fi";
import { FaAppleAlt, FaRunning, FaTint } from "react-icons/fa";
import Header from "../components/Header";
import Botao from "../components/Botao";
import CardDica from "../components/CardDica";

// Para usar as ilustrações do protótipo, importe a imagem e passe em "imagem"
// (ex.: imagem: saladaImg). Sem "imagem", o cartão mostra o ícone.
// Os cartões 5 e 6 são exemplos: troque pelos conteúdos reais.
const dicas = [
  { id: 1, titulo: "Alimentação inteligente", descricao: "5 receitas com baixo IG", Icone: FaAppleAlt, corIcone: "bg-green-100 text-green-600" },
  { id: 2, titulo: "Atividade física durante a gestação", descricao: "Exercícios seguros para seu 2º trimestre", Icone: FaRunning, corIcone: "bg-pink-100 text-pink-500" },
  { id: 3, titulo: "Entendendo a Glicose", descricao: "Como interpretar seus números", Icone: FaTint, corIcone: "bg-teal-100 text-teal-700" },
  { id: 4, titulo: "Cuidados de emergência", descricao: "Sinais de alerta importantes", Icone: FiAlertCircle, corIcone: "bg-pink-400 text-white" },
  { id: 5, titulo: "Sono e descanso", descricao: "Dicas para dormir melhor", Icone: FiMoon, corIcone: "bg-teal-100 text-teal-700" },
  { id: 6, titulo: "Consultas e exames", descricao: "O que não pode faltar no pré-natal", Icone: FiCalendar, corIcone: "bg-green-100 text-green-600" },
];

function DicasEducativas() {
  const [selecionadas, setSelecionadas] = useState([]);
  const [favoritas, setFavoritas] = useState([]);

  const alternar = (id) =>
    setSelecionadas((atual) =>
      atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id]
    );

  const favoritar = () => {
    setFavoritas((atual) => [...new Set([...atual, ...selecionadas])]);
    setSelecionadas([]);
  };

  const qtd = selecionadas.length;

  return (
    <section className="font-[Poppins] w-full max-w-5xl mx-auto px-4 pb-10 text-teal-800">
      <Header
        titulo="Dicas Educativas"
        component={<FiBookOpen className="text-pink-400 text-5xl" aria-hidden="true" />}
        component2={
            <div className="mt-8 flex flex-col items-center gap-2">
        <Botao
          nome={qtd > 0 ? `+ Adicionar ${qtd} ${qtd === 1 ? "dica" : "dicas"} aos favoritos` : "+ Adicionar dicas aos favoritos"}
          tipoDado="button"
          clickHandler={favoritar}
          disabled={qtd === 0}
          className="bg-teal-600 text-white rounded-2xl text-[20px] font-semibold p-5 sm:p-4 font-poppins flex gap-3 justify-center items-center cursor-pointer transition-transform duration-500 hover:scale-105 w-full md:w-80 focus:outline-none shadow-xl"
          textClassName="text-[15px]"
        />
        <p className=" text-teal-700/80 text-[15px]" role="status">
          {qtd === 0
            ? "Toque nos cartões para escolher as dicas."
            : `${qtd} ${qtd === 1 ? "dica selecionada" : "dicas selecionadas"}.`}
        </p>
      </div>
        }
      />

      <h3 className="font-poppins text-3xl font-semibold text-teal-600 mt-2 mb-5">
        Biblioteca de conteúdos
      </h3>

      {/* Painel rolável: a seta indica que há mais conteúdo */}
      <div className="rounded-3xl border-2 border-teal-200 bg-white/70 p-4 sm:p-6">
        <ul className="grid gap-4 sm:grid-cols-2 overflow-y-auto pr-1">
          {dicas.map((dica) => (
            <li key={dica.id}>
              <CardDica
                {...dica}
                selecionado={selecionadas.includes(dica.id)}
                favoritado={favoritas.includes(dica.id)}
                aoAlternar={() => alternar(dica.id)}
              />
            </li>
          ))}
        </ul>

        <FiChevronDown className="mx-auto mt-3 text-2xl text-teal-700" aria-hidden="true" />
      </div>

      
    </section>
  );
}

export default DicasEducativas;