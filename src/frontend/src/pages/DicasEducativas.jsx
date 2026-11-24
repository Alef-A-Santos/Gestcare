import { useEffect, useState } from "react";
import { FiAlertCircle, FiMoon, FiCalendar } from "react-icons/fi";
import { FaAppleAlt, FaRunning, FaTint } from "react-icons/fa";
import Header from "../components/Header";
import CardDica from "../components/CardDica";
import { LuNotebookPen } from "react-icons/lu";

const dicas = [
  {
    id: 1,
    titulo: "Alimentação inteligente",
    descricao: "Melhores alimentos para consumir durante a gravidez",
    texto:
      "Uma alimentação variada ajuda a compor refeições equilibradas. Sempre que possível, inclua verduras e legumes, uma fonte de proteína (como feijão, ovos ou carnes bem cozidas) e alimentos ricos em fibras, como aveia e grãos integrais.\n\nPrefira frutas inteiras a sucos e distribua as refeições conforme o plano combinado com sua equipe. Lave bem frutas e verduras e evite alimentos crus ou malpassados que possam trazer risco de infecção.\n\nNa diabetes gestacional, as necessidades variam de pessoa para pessoa. Não faça dietas restritivas nem exclua grupos alimentares sem orientação; uma nutricionista ou profissional do pré-natal pode ajudar a adaptar as escolhas e os horários.",
    imagem:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmCF2BUMcdYTWm2T_FUXKIgyAZfVR9WgQQQFzVbzzn2w&s=10",
    Icone: FaAppleAlt,
    corIcone: "bg-green-100 text-green-600",
  },
  {
    id: 2,
    titulo: "Atividade física durante a gestação",
    descricao: "Exercícios seguros para seu 2º trimestre",
    texto:
      "Se sua equipe liberar, atividades moderadas, como caminhada, dança leve ou exercícios na água, podem fazer parte da rotina. Comece aos poucos, use roupas confortáveis, mantenha-se hidratada e escolha um ritmo em que ainda consiga conversar.\n\nEvite atividades com risco de queda, colisão ou superaquecimento. Faça pausas quando precisar e não tente compensar um dia parado com esforço intenso.\n\nPare e procure orientação se sentir tontura, falta de ar fora do habitual, dor no peito, sangramento, contrações dolorosas ou mal-estar. Converse com seu profissional antes de iniciar ou mudar os exercícios, especialmente se houver alguma complicação na gestação.",
    imagem:
      "https://s2.glbimg.com/cLrMLjTi3SkU3zpFe200P8N9Mcw=/620x480/e.glbimg.com/og/ed/f/original/2020/01/23/gettyimages-887276442.jpg",
    Icone: FaRunning,
    corIcone: "bg-pink-100 text-pink-500",
  },
  {
    id: 3,
    titulo: "Como medir a sua glicemia",
    descricao: "Manual para realizar a medição de sua glicemia",
    texto:
      "Anote cada resultado com a data, o horário e a relação com as refeições, conforme a orientação recebida. Use sempre seu próprio aparelho e materiais, e siga também as instruções específicas do fabricante do glicosímetro.\n\nOs valores de referência abaixo são os informados para este conteúdo. As metas podem variar conforme a orientação da equipe que acompanha sua gestação; leve seu registro às consultas para interpretá-lo junto ao profissional.",
    imagem:
      "https://static1.minhavida.com.br/articles/81/3d/88/84/mulher-gravida-medindo-a-glicemia-no-dedo-orig-1.jpg",
    Icone: FaTint,
    corIcone: "bg-teal-100 text-teal-700",
  },
  {
    id: 4,
    titulo: "Cuidados de emergência",
    descricao: "Sinais de alerta importantes",
    texto:
      "Na gestação, procure atendimento diante de sangramento vaginal, perda de líquido, dor forte ou persistente, falta de ar importante, desmaio, convulsão, dor de cabeça intensa com alteração visual ou redução importante dos movimentos do bebê quando você já os percebe regularmente.\n\nSe houver uma emergência, ligue para o serviço de urgência da sua região ou vá ao pronto atendimento. Não espere a próxima consulta para relatar sintomas súbitos ou que estejam piorando.\n\nEm situações menos intensas, mas que preocupem você, entre em contato com a equipe do pré-natal para receber orientação. Mantenha à mão seus documentos, cartão de pré-natal e lista de medicamentos.",
    imagem:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf44FK7e6NS34OV2VRzXS_vQMkqIyX0672QnGtEOqpGG6OxYl7d3dDMjAn&s=10",
    Icone: FiAlertCircle,
    corIcone: "bg-pink-400 text-white",
  },
  {
    id: 5,
    titulo: "Sono e descanso",
    descricao: "Dicas para dormir melhor",
    texto:
      "Tente manter horários parecidos para dormir e acordar. Um ambiente escuro, silencioso e confortável, além de uma rotina tranquila antes de deitar, pode ajudar. Reduza telas e bebidas com cafeína perto da hora de dormir, conforme a orientação da sua equipe.\n\nNa gravidez, pode ser mais confortável dormir de lado, usando travesseiros para apoiar a barriga e as pernas. Descanse durante o dia se precisar, mas observe se cochilos longos atrapalham o sono à noite.\n\nAzia, dor, ansiedade ou vontade frequente de urinar podem interferir no descanso. Se o problema persistir, converse com seu profissional de saúde antes de usar remédios ou suplementos para dormir.",
    imagem:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgCGQAQcdL_yCfek9aVH_egox0xVQfaaaVtx0NB4FApW3MmtQ5rYsr1gG-&s=10",
    Icone: FiMoon,
    corIcone: "bg-teal-100 text-teal-700",
  },
  {
    id: 6,
    titulo: "Consultas e exames",
    descricao: "O que não pode faltar nas consultas e exames",
    texto:
      "Compareça às consultas do pré-natal nas datas combinadas e pergunte como remarcar se não puder ir. Leve seu cartão de pré-natal, resultados de exames, lista de medicamentos e registro das medições de glicose, se houver.\n\nAnote dúvidas entre as consultas: alimentação, atividade física, sintomas, parto e amamentação são bons temas para conversar. Informe à equipe sobre mudanças na saúde, medicamentos que usa e qualquer dificuldade para seguir o plano de cuidado.\n\nOs exames e vacinas recomendados dependem da fase da gestação e do seu histórico. Peça à equipe para explicar para que serve cada exame e quando buscar o resultado; não deixe de procurar orientação se algo não estiver claro.",
    imagem:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9bV2vp8fT6dWR3me-qB0eXuhtXt-_CLYxxMGiwGXav84qJuynNWDs-aw&s=10",
    Icone: FiCalendar,
    corIcone: "bg-green-100 text-green-600",
  },
];

function DicasEducativas() {
  const [dicaAberta, setDicaAberta] = useState(null);

  useEffect(() => {
    if (!dicaAberta) return undefined;
    const fecharComEscape = (evento) => {
      if (evento.key === "Escape") setDicaAberta(null);
    };
    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, [dicaAberta]);

  return (
    <section className="dicas-educativas font-[Poppins] w-full max-w-5xl mx-auto px-4 pb-10 text-teal-800">
      <Header
        titulo="Dicas Educativas"
        tituloClassName="text-4xl sm:text-5xl"
        tituloContainerClassName="mt-5 mb-0 sm:my-5"
        component={
          <LuNotebookPen
            className="text-pink-400 text-4xl sm:text-5xl transition-transform duration-500 hover:scale-105 "
            aria-hidden="true"
          />
        }
        component2={
          <div className="mt-8 flex flex-col items-center gap-2"></div>
        }
      />

      <div className="w-full">
        <h3 className="font-poppins text-3xl font-semibold text-teal-600 mt-0 sm:mt-2 mb-8 sm:text-5xl">
          Biblioteca de conteúdos
        </h3>
      </div>

      {/* Painel rolável: a seta indica que há mais conteúdo */}
      <div className="rounded-3xl border-2 border-teal-200 bg-white/70 p-4 sm:p-6">
        <ul className="grid gap-4 sm:grid-cols-2 overflow-y-auto pr-1">
          {dicas.map((dica) => (
            <li key={dica.id}>
              <CardDica
                {...dica}
                aoAbrir={() => setDicaAberta(dica)}
              />
            </li>
          ))}
        </ul>
      </div>

      {dicaAberta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) setDicaAberta(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-dica"
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setDicaAberta(null)}
              aria-label="Fechar dica"
              className="botao-fechar-dica absolute right-4 top-4 z-10 rounded-full bg-white/95 px-3 py-2 text-xl text-teal-800 shadow"
            >
              ×
            </button>
            <div className="flex max-h-[42vh] min-h-48 items-center justify-center overflow-hidden bg-teal-50">
              <img
                src={dicaAberta.imagem}
                alt={dicaAberta.titulo}
                className="max-h-[42vh] w-full object-contain"
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="mb-2 text-base font-semibold uppercase tracking-wide text-pink-500 sm:text-lg">
                Dica educativa
              </p>
              <h2
                id="titulo-dica"
                className="font-[Playfair_Display] text-2xl font-semibold text-pink-500 sm:text-3xl"
              >
                {dicaAberta.titulo}
              </h2>
              {dicaAberta.id === 3 ? (
                <div className="mt-5 space-y-5 text-base leading-7 text-teal-900/80 sm:text-lg sm:leading-8">
                  <div>
                    <h3 className="text-lg font-semibold text-teal-800 sm:text-xl">
                      Materiais necessários
                    </h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>Glicosímetro</li>
                      <li>Fita reagente</li>
                      <li>Lanceta ou caneta lancetadora</li>
                      <li>Algodão</li>
                      <li>Álcool 70%</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-teal-800 sm:text-xl">
                      Procedimento
                    </h3>
                    <ol className="mt-2 list-decimal space-y-2 pl-5">
                      <li>Higienize as mãos corretamente com água e sabão.</li>
                      <li>
                        Insira a fita reagente no glicosímetro e espere aparecer
                        uma imagem de gota ou uma contagem de números.
                      </li>
                      <li>
                        Se possível, higienize o dedo com algodão e álcool 70%.
                      </li>
                      <li>
                        Aplique pressão com a lanceta ou caneta lancetadora
                        sobre o dedo de sua preferência.
                      </li>
                      <li>
                        Forme uma gota mais cheia de sangue e encoste-a na fita
                        reagente acoplada ao glicosímetro.
                      </li>
                      <li>
                        Aguarde o resultado e limpe o dedo com algodão seco.
                      </li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-teal-800 sm:text-xl">
                      Valores de referência
                    </h3>
                    <ul className="mt-2 space-y-1">
                      <li>Jejum: 65–95 mg/dL</li>
                      <li>
                        Pós-prandial (1 hora após a refeição): &lt;140 mg/dL
                      </li>
                      <li>
                        Pós-prandial (2 horas após a refeição): &lt;120 mg/dL
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="mt-4 whitespace-pre-line text-base leading-8 text-teal-900/80 sm:text-lg sm:leading-9">
                  {dicaAberta.texto}
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default DicasEducativas;
