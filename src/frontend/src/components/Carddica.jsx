import { FiHeart } from "react-icons/fi";

function CardDica({ titulo, descricao, Icone, corIcone, imagem, selecionado, favoritado, aoAlternar }) {
  return (
    <button
      type="button"
      onClick={aoAlternar}
      aria-pressed={selecionado}
      className={`relative w-full text-left rounded-3xl bg-white p-5 border-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-200 hover:shadow-md ${
        selecionado ? "border-pink-400 shadow-md" : "border-teal-200"
      }`}
    >
      {favoritado && (
        <FiHeart
          className="absolute top-4 right-4 fill-pink-400 text-pink-400"
          aria-label="Nos favoritos"
        />
      )}

      <span className="block font-[Playfair_Display] text-xl font-semibold text-teal-800 pr-6">
        {titulo}
      </span>

      <span className="flex items-center gap-4 mt-4">
        {imagem ? (
          <img src={imagem} alt="" className="w-24 h-24 object-contain shrink-0" />
        ) : (
          <span
            className={`w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center text-4xl ${corIcone}`}
            aria-hidden="true"
          >
            {Icone && <Icone />}
          </span>
        )}
        <span className="text-sm font-medium text-teal-800/90">{descricao}</span>
      </span>
    </button>
  );
}

export default CardDica;