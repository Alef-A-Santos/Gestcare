function CardDica({ titulo, descricao, Icone, corIcone, imagem, aoAbrir }) {
  return (
    <button
      type="button"
      onClick={aoAbrir}
      aria-label={`Abrir dica: ${titulo}`}
      className="relative w-full text-left rounded-3xl bg-white p-5 border-2 border-teal-200 transition-all cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-200 hover:shadow-md"
    >
      <span className="block font-[Playfair_Display] text-xl font-semibold text-pink-500 pr-6 sm:text-2xl">
        {titulo}
      </span>

      <span className="flex items-center gap-4 mt-4">
        {imagem ? (
          <img src={imagem} alt="" loading="lazy" className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
        ) : (
          <span
            className={`w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center text-4xl ${corIcone}`}
            aria-hidden="true"
          >
            {Icone && <Icone />}
          </span>
        )}
        <span className="text-base font-medium leading-relaxed text-teal-800/90 sm:text-lg">{descricao}</span>
      </span>
    </button>
  );
}

export default CardDica;
