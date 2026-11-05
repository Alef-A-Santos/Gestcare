import Card from "./Card";
import Badge from "./Badge";
 
function CardInfo({ UltimaAfericao, nivel, data, horario }) {
  return (
    <Card titulo="Última medição">
      <p className="text-4xl font-poppins font-bold text-teal-500 text-center">
        {UltimaAfericao}
      </p>
      <div className="flex gap-3 mt-3 justify-center items-center">
        <Badge nivel={nivel} />
      </div>
      <div className="flex gap-3 mt-2 justify-center items-center text-zinc-500">
        <p className="text-base font-poppins">{data}</p>
        <p className="text-base font-poppins">{horario}</p>
      </div>
    </Card>
  );
}
 
export default CardInfo;
 
