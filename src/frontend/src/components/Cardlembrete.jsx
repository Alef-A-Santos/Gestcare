import Card from "./Card";
import Botao from "./Botao";
 
function CardLembrete({ lembrete, aoCriar }) {
  return (
    <Card titulo="Próximo lembrete">
      {lembrete ? (
        <p className="text-xl font-poppins text-zinc-700">{lembrete}</p>
      ) : (
        <>
          <p className="text-xl font-poppins text-zinc-400 mb-4">
            Sem nenhum lembrete agendado
          </p>
          <Botao
            nome="Criar lembrete"
            tipo="button"
            clickHandler={aoCriar}
            className="rounded-full bg-pink-300 hover:bg-pink-400 transition text-white font-poppins font-medium px-6 py-2 cursor-pointer"
          />
        </>
      )}
    </Card>
  );
}
 
export default CardLembrete;