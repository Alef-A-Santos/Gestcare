import Card from "./Card";
 
function CardGestacao({ semanas, dias, trimestre, dataParto, className = "" }) {
  return (
    <Card titulo="Gestação" className={className}>
      <p className="text-center text-teal-500">
        <span className="text-5xl font-playfair font-bold">{semanas}</span>
        <span className="text-xl font-poppins ml-2">sem {dias}d</span>
      </p>
      <p className="text-lg font-poppins text-zinc-500 mt-3 text-center">
        {trimestre}º trimestre · parto previsto em{" "}
        <span className="text-pink-400 font-medium">{dataParto}</span>
      </p>
    </Card>
  );
}
 
export default CardGestacao;