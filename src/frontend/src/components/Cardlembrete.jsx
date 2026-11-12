import Card from "./Card";
import Botao from "./Botao";
import { FaCalendarCheck, FaPills, FaSyringe, FaTint, FaUtensils } from "react-icons/fa";

const CATEGORIAS = {
  glicemia: { nome: "Glicemia", Icone: FaSyringe },
  medicao: { nome: "Medicação", Icone: FaPills },
  medicacao: { nome: "Medicação", Icone: FaPills },
  alimentacao: { nome: "Alimentação", Icone: FaUtensils },
  consulta: { nome: "Consulta", Icone: FaCalendarCheck },
  hidratacao: { nome: "Hidratação", Icone: FaTint },
};
 
function CardLembrete({ lembretes = [], lembrete, aoCriar }) {
  const lista = Array.isArray(lembretes) ? lembretes : (lembrete ? [lembrete] : []);
  return (
    <Card titulo="Próximos lembretes">
      {lista.length > 0 ? (
        <>
          <ul className="space-y-2">
            {lista.map((item, indice) => {
              const categoriaKey = String(item?.categoria || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
              const categoria = CATEGORIAS[categoriaKey];
              const Icone = categoria?.Icone || FaCalendarCheck;
              return <li key={item.id_lembrete || item.id || `${item.titulo}-${indice}`} className="flex items-center gap-3 rounded-xl bg-white/70 p-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e0efee] text-[#1f9d8e]" aria-hidden="true"><Icone size={20} /></span>
                <div className="min-w-0">
                  <p className="truncate text-lg font-medium font-poppins text-zinc-700">{item.titulo}</p>
                  <p className="text-sm font-poppins text-zinc-500">{String(item.horario || item.hora || "").slice(0, 5)}{categoria ? ` · ${categoria.nome}` : item.categoria ? ` · ${item.categoria}` : ""}</p>
                </div>
              </li>;
            })}
          </ul>
          <Botao nome="Ver lembretes" tipo="button" clickHandler={aoCriar}
            className="mt-4 rounded-full bg-pink-300 hover:bg-pink-400 transition text-white font-poppins font-medium px-6 py-2 cursor-pointer" />
        </>
      ) : (
        <>
          <p className="text-xl font-poppins text-zinc-400 mb-4 text-center">
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
