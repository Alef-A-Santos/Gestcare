import Card from "./Card";
 
function CardDiario({ refeicoes }) {
  return (
    <Card titulo="Diário alimentar de hoje:" className="[&>h2]:text-teal-600">
      <ul className="flex flex-col gap-2">
        {refeicoes.map((refeicao) => (
          <li
            key={refeicao}
            className="flex items-center gap-3 font-poppins text-lg text-zinc-700"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-pink-300" />
            {refeicao}
          </li>
        ))}
      </ul>
    </Card>
  );
}
 
export default CardDiario;