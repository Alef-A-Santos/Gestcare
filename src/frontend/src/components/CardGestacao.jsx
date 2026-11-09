import Card from "./Card";

function CardGestacao({ semanas, dias, trimestre, dataParto, className = "" }) {
  const semanasFormatadas = typeof semanas === "string"
    ? semanas
    : <><span className="text-5xl font-poppins font-bold">{semanas}</span><span className="text-xl font-poppins ml-2">sem {dias}d</span></>;

  return (
    <Card titulo="Gestação" className={className}>
      <p className="text-center text-teal-500 font-bold text-3xl">{semanasFormatadas}</p>
      {dataParto && (
        <p className="text-lg font-poppins text-zinc-500 mt-3 text-center">
          {trimestre && <>{trimestre} · </>}parto previsto em{" "}
          <span className="text-pink-400 font-medium">{dataParto}</span>
        </p>
      )}
    </Card>
  );
}

export default CardGestacao;
