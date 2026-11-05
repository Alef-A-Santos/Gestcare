function Card({ titulo, children, className = "" }) {
  return (
    <section
      className={`bg-rose-50 border-2 border-teal-600 rounded-2xl p-4 sm:p-5 shadow-md ${className}`}
    >
      {titulo && (
        <h3 className="font-playfair text-pink-400 text-xl sm:text-[22px] font-bold mb-4 text-center">
          {titulo}
        </h3>
      )}
      {children}
    </section>
  );
}

export default Card;