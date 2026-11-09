import Card from "./Card";
 
function CardMarco({ semana, comparacao, descricao }) {
  const semanaExibida = (() => {
    if (semana == null) return "Sem dados";
    const texto = String(semana).trim();
    const numero = texto.match(/\d+/);
    return numero ? `${numero[0]}+` : texto;
  })();

  return (
    <Card titulo="Marco da Semana">
      <p className="text-teal-500 font-poppins mb-4 text-center font-bold text-2xl">Semana {semanaExibida}</p>
      <p className="text-center font-poppins">
        {comparacao && <span className="text-pink-400">{comparacao} — </span>}
        <span className="text-zinc-700">{descricao}</span>
      </p>
    </Card>
  );
}
 
export default CardMarco;
