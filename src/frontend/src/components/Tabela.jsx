import { Fragment } from "react";

/**
 * colunas: [{ chave, titulo, render?: (linha) => ReactNode, className? }]
 * dados:   array de objetos com `id`
 * acoes:   (linha) => ReactNode   (opcional, vira a última coluna)
 *
 * Telas >= sm: tabela normal.
 * Telas < sm: cada linha vira um mini-card (título: valor).
 */
function Tabela({ colunas, dados, acoes, mensagemVazia = "Nenhum registro ainda." }) {
  if (dados.length === 0) {
    return (
      <p className="font-poppins text-gray-500 text-center py-10">{mensagemVazia}</p>
    );
  }

  const celula = (col, linha) => (col.render ? col.render(linha) : linha[col.chave]);

  return (
    <>
      {/* Mobile: lista de cards */}
      <ul className="sm:hidden flex flex-col gap-3 font-poppins text-gray-800">
        {dados.map((linha) => (
          <li
            key={linha.id}
            className="rounded-xl border border-teal-600/40 bg-white/60 p-3"
          >
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
              {colunas.map((col) => (
                <Fragment key={col.chave}>
                  <dt className="font-playfair text-pink-400 font-bold">{col.titulo}</dt>
                  <dd>{celula(col, linha)}</dd>
                </Fragment>
              ))}
            </dl>
            {acoes && <div className="mt-2 flex justify-end">{acoes(linha)}</div>}
          </li>
        ))}
      </ul>

      {/* Tablet/desktop: tabela */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full font-poppins text-gray-800 border-collapse">
          <thead>
            <tr className="border-b-2 border-teal-600">
              {colunas.map((col) => (
                <th
                  key={col.chave}
                  scope="col"
                  className="font-playfair text-pink-400 text-lg lg:text-2xl font-bold text-left px-3 py-2"
                >
                  {col.titulo}
                </th>
              ))}
              {acoes && (
                <th scope="col" className="px-3 py-2">
                  <span className="sr-only">Ações</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {dados.map((linha) => (
              <tr
                key={linha.id}
                className="border-b border-teal-600/40 last:border-b-0 hover:bg-pink-100/60 transition-colors"
              >
                {colunas.map((col) => (
                  <td key={col.chave} className={`px-3 py-3 ${col.className ?? ""}`}>
                    {celula(col, linha)}
                  </td>
                ))}
                {acoes && <td className="px-3 py-3 text-right">{acoes(linha)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Tabela;