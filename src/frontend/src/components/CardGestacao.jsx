import Card from "./Card";

function CardGestacao({ semanas, trimestre, dataParto, className = "" }) {
  const semanasSemDias = typeof semanas === "string"
    ? semanas.replace(/\s*(?:e\s*)?\d+\s*dias?\b.*$/i, "").trim()
    : semanas;
  const semanasFormatadas = typeof semanasSemDias === "string"
    ? semanasSemDias
    : <><span className="text-5xl font-poppins font-bold">{semanasSemDias}</span><span className="text-xl font-poppins ml-2">semanas</span></>;

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
