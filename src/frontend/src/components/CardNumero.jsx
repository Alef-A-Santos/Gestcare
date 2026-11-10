import { FiPhoneCall } from "react-icons/fi";
import Botao from "./Botao";

function CardNumero({ numero, titulo, descricao, destaque = false, aoLigar }) {
  const base = "rounded-2xl p-6 flex gap-4 transition-shadow hover:shadow-md";

  if (destaque) {
    return (
      <article
        className={`${base} bg-pink-400 text-white flex-col sm:flex-row sm:items-center sm:justify-between md:col-span-3`}
      >
        <div>
          <p className="font-poppins text-6xl font-bold leading-none">{numero}</p>
          <h3 className="font-playfair text-2xl font-semibold mt-3">{titulo}</h3>
          <p className="text-sm text-pink-50 mt-1 max-w-md text-[15px]">{descricao}</p>
        </div>

        <Botao
          nome={`Ligar para o ${titulo}`}
          tipoDado="button"
          clickHandler={() => aoLigar(numero)}
          Component={FiPhoneCall}
          className="flex items-center gap-3 bg-white text-pink-500 font-semibold rounded-full px-6 py-3 cursor-pointer hover:bg-pink-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
          textClassName="text-base"
        />
      </article>
    );
  }

  return (
    <article className={`${base} bg-white border border-teal-100 flex-col justify-between`}>
      <div>
        <p className="font-poppins text-5xl font-semibold text-pink-400 leading-none">{numero}</p>
        <h3 className="font-semibold text-teal-800 mt-3 text-2xl">{titulo}</h3>
        <p className="text-sm text-teal-700/80 mt-1 text-[15px]">{descricao}</p>
      </div>

      <Botao
        nome="Ligar"
        tipoDado="button"
        clickHandler={() => aoLigar(numero)}
        className="w-full rounded-full border-2 border-teal-600 text-teal-700 font-medium py-2 px-5 cursor-pointer hover:bg-teal-600 hover:text-white transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-200"
      />
    </article>
  );
}

export default CardNumero;