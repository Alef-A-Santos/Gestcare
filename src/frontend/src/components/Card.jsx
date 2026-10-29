function Card({ titulo, children, className = "" }) {
  return (
    <section
      className={`bg-white p-5 rounded-2xl shadow border-2 border-teal-500 transition hover:shadow-lg ${className}`}
    >
      {titulo && (
        <h2 className="text-2xl text-center  font-poppins text-zinc-800 mb-4">{titulo}</h2>
      )}
      {children}
    </section>
  );
}
 
export default Card;