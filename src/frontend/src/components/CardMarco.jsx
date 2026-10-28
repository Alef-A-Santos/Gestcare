import Card from "./Card";
 
function CardMarco({ semana, comparacao, descricao }) {
  return (
    <Card titulo="Marco da Semana">
      <p className="text-teal-500 font-poppins mb-4">Semana {semana}</p>
      <p className="text-center font-poppins">
        <span className="text-pink-400">{comparacao} — </span>
        <span className="text-zinc-700">{descricao}</span>
      </p>
    </Card>
  );
}
 
export default CardMarco;