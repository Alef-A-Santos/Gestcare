import Card from "./Card";
import Botao from "./Botao";
import { FaCalendarCheck, FaPills, FaSyringe, FaTint, FaUtensils } from "react-icons/fa";

const CHAVE_CATEGORIAS_LEMBRETES = "gestcare_categorias_lembretes";
const CATEGORIAS = {
  glicemia: { nome: "Glicemia", Icone: FaSyringe, iconClass: "bg-[#e0efee] text-[#1f9d8e]" },
  medicao: { nome: "Medicação", Icone: FaPills, iconClass: "bg-[#f3e6ec] text-[#b03a6a]" },
  medicacao: { nome: "Medicação", Icone: FaPills, iconClass: "bg-[#f3e6ec] text-[#b03a6a]" },
  alimentacao: { nome: "Alimentação", Icone: FaUtensils, iconClass: "bg-[#e0efee] text-[#1f9d8e]" },
  consulta: { nome: "Consulta", Icone: FaCalendarCheck, iconClass: "bg-[#e0efee] text-[#1f9d8e]" },
  hidratacao: { nome: "Hidratação", Icone: FaTint, iconClass: "bg-[#f3e6ec] text-[#d46a9a]" },
};

function normalizarCategoria(valor) {
  return String(valor || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function categoriaSalva(item) {
  try {
    const categorias = JSON.parse(localStorage.getItem(CHAVE_CATEGORIAS_LEMBRETES) || "{}");
    const recorrencia = Array.isArray(item.recorrencia)
      ? item.recorrencia.join(",")
      : String(item.recorrencia || "");
    const chave = [item.titulo, String(item.horario || item.hora || "").slice(0, 5), recorrencia]
      .map((parte) => String(parte || "").trim().toLowerCase())
      .join("|");
    return categorias[chave];
  } catch {
    return "";
  }
}
 
function CardLembrete({ lembretes = [], lembrete, aoCriar, somenteLeitura = false }) {
  const lista = Array.isArray(lembretes) ? lembretes : (lembrete ? [lembrete] : []);
  return (
    <Card titulo="Próximos lembretes">
      {lista.length > 0 ? (
        <>
          <ul className="space-y-1.5">
            {lista.map((item, indice) => {
              const categoriaKey = normalizarCategoria(item?.categoria || item?.tipo || categoriaSalva(item));
              const categoria = CATEGORIAS[categoriaKey] || CATEGORIAS.glicemia;
              const Icone = categoria.Icone;
              return <li key={item.id_lembrete || item.id || `${item.titulo}-${indice}`} className="flex items-center gap-3 rounded-xl border border-white/40 bg-white/70 p-2.5">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-white text-xl shadow-md ring-2 ring-black/5 ${categoria.iconClass}`} aria-hidden="true"><Icone /></span>
                <div className="min-w-0">
                  <p className="truncate text-lg font-medium font-poppins text-zinc-700">{item.titulo}</p>
                  <p className="text-sm font-poppins text-zinc-500">{String(item.horario || item.hora || "").slice(0, 5)} · {categoria.nome}</p>
                </div>
              </li>;
            })}
          </ul>
          <Botao nome="Ver lembretes" tipo="button" clickHandler={aoCriar}
            className="mt-3 rounded-full bg-pink-300 hover:bg-pink-400 transition text-white font-poppins font-medium px-6 py-1.5 cursor-pointer" />
        </>
      ) : (
        <>
          <p className="text-xl font-poppins text-zinc-400 mb-4 text-center">
            Sem nenhum lembrete agendado
          </p>
          {!somenteLeitura && <Botao
            nome="Criar lembrete"
            tipo="button"
            clickHandler={aoCriar}
            className="rounded-full bg-pink-300 hover:bg-pink-400 transition text-white font-poppins font-medium px-6 py-2 cursor-pointer"
          />}
        </>
      )}
    </Card>
  );
}
 
export default CardLembrete;
