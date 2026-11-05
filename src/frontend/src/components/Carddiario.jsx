import Card from "./Card";

function CardDiario({ refeicoes = [] }) {
  return (
    <Card titulo="Diário alimentar de hoje:" className="[&>h2]:text-teal-600">
      {refeicoes.length === 0 ? (
        <p className="font-poppins text-zinc-600">Nenhuma refeição registrada hoje.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {refeicoes.map((refeicao) => (
            <li
              key={refeicao.id_refeicao}
              className="flex items-start gap-3 font-poppins text-zinc-700"
            >
              <span className="mt-2 w-2.5 h-2.5 shrink-0 rounded-full bg-pink-300" />
              <span>
                <strong className="block">{refeicao.tipo_refeicao}</strong>
                <span>{refeicao.descricao_alimentos}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default CardDiario;
