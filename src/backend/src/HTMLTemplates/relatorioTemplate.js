import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { formatarData } from "../utils/formatter.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const caminho_imagem = resolve(
  __dirname,
  "..",
  "assets",
  "imagens",
  "logo_rosa.png",
);
const imagemBase64 = readFileSync(caminho_imagem, { encoding: "base64" }); // Conversão da imagem para base64(Texto puro), para que o puppeteer possa carregá-la sem procurar em nenhuma pasta

const classificacoes = {
  B: "Baixa",
  N: "Normal",
  A: "Alta",
};

const meses = {
  1: "Janeiro",
  2: "Fevereiro",
  3: "Março",
  4: "Abril",
  5: "Maio",
  6: "Junho",
  7: "Julho",
  8: "Agosto",
  9: "Setembro",
  10: "Outubro",
  11: "Novembro",
  12: "Dezembro",
};

const templateTrSemRegistro = `<tr colspan="3"><td>Sem registros</td></tr>`;


export function gerarTemplateRelatorio(dados) {
  return `
  <!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Medições - Gestcare</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --rosa-suave: #F4A6B0;
      --rosa-light: #FDF5F6;
      --verde-claro: #A8D5BA;
      --verde-light: #F0F7F3;
      --azul-pastel: #B3D9F2;
      --azul-light: #F2F8FC;
      --branco: #FFFFFF;
      --cinza-texto: #4A4A4A;
      --cinza-neutro: #7A7A7A;
      --cinza-claro: #F8F9FA;
      --cinza-borda: #E9ECEF;
      --sombra: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    body {
      background-color: #F3F5F7;
      color: var(--cinza-texto);
      line-height: 1.6;
      padding: 40px 20px;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      background-color: var(--branco);
      border-radius: 16px;
      box-shadow: var(--sombra);
      overflow: hidden;
    }

    /* HEADER */
    header {
      background: linear-gradient(135deg, var(--rosa-light) 0%, var(--azul-light) 100%);
      padding: 30px 40px;
      display: flex;
      align-items: center;
      gap: 24px;
      border-bottom: 2px solid var(--rosa-suave);
    }

    .imagem-container {
      width: 80px;
      height: 80px;
      background: var(--branco);
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .imagem-container img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .content-header h1 {
      font-size: 1.5rem;
      color: #2D3748;
      font-weight: 700;
      margin-bottom: 2px;
    }

    .content-header .nome-paciente {
      font-size: 1.15rem;
      color: var(--cinza-texto);
      font-weight: 600;
      margin-bottom: 2px;
    }

    .content-header .periodo-relatorio {
      font-size: 0.9rem;
      color: var(--cinza-neutro);
    }

    /* MAIN CONTENT */
    main {
      padding: 40px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    h2 {
      font-size: 1.25rem;
      color: #2D3748;
      border-left: 4px solid var(--rosa-suave);
      padding-left: 12px;
      margin-bottom: 4px;
    }

    h3 {
      font-size: 1.05rem;
      color: var(--cinza-neutro);
      font-weight: 600;
    }

    /* SUMÁRIO */
    .sumario {
      background-color: var(--cinza-claro);
      padding: 20px 24px;
      border-radius: 12px;
      border: 1px solid var(--cinza-borda);
    }

    .sumario .items {
      padding-left: 20px;
      margin-top: 8px;
    }

    .items li {
      margin-bottom: 6px;
      color: var(--cinza-neutro);
    }

    .items a {
      text-decoration: none;
      color: var(--cinza-texto);
      font-weight: 500;
      transition: color 0.2s;
    }

    .items a:hover {
      color: var(--rosa-suave);
    }

    .sublista {
      padding-left: 20px;
      margin-top: 4px;
    }

    /* CARDS DE DESTAQUE */
    .cards-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 8px;
    }

    .card-stat {
      padding: 16px;
      border-radius: 10px;
      border-left: 4px solid var(--azul-pastel);
      background-color: var(--azul-light);
    }

    .card-stat.verde {
      border-left-color: var(--verde-claro);
      background-color: var(--verde-light);
    }

    .card-stat label {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--cinza-neutro);
      display: block;
      margin-bottom: 4px;
      font-weight: 600;
    }

    .card-stat .valor {
      font-size: 1.3rem;
      font-weight: 700;
      color: #2D3748;
    }

    /* TABELAS */
    .table-container {
      width: 100%;
      overflow-x: auto;
      border-radius: 10px;
      border: 1px solid var(--cinza-borda);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.9rem;
    }

    th {
      background-color: var(--azul-pastel);
      color: #1A365D;
      font-weight: 600;
      padding: 12px 16px;
      border: none;
    }

    td {
      padding: 12px 16px;
      border-top: 1px solid var(--cinza-borda);
      color: var(--cinza-texto);
    }

    tbody tr:nth-child(even) {
      background-color: #FAFBFD;
    }

    tbody tr:hover {
      background-color: #F1F5F9;
    }

    /* Destaque para extremos */
    .resumo_registros {
      background-color: var(--rosa-light) !important;
      font-weight: 600;
    }

    .resumo_registros td {
      border-top: 1px solid var(--rosa-suave);
      color: #8C2A36;
    }

    /* IMPRESSÃO / PDF */
    @media print {
      body {
        background-color: var(--branco);
        padding: 0;
      }
      .container {
        box-shadow: none;
        max-width: 100%;
      }
      th {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="imagem-container">
        <img src="data:image/png;base64,${imagemBase64}" alt="Logo Gestcare">
      </div>
      <div class="content-header">
        <h1>Relatório de medições</h1>
        <div class="nome-paciente">${dados.nome_gestante}</div>
        <div class="periodo-relatorio">${dados.periodo}</div>
      </div>
    </header>

    <main>
      <!-- SUMÁRIO -->
      <section class="sumario">
        <h2>Sumário</h2>
        <ol class="items">
          <li>
            <a href="#registros">Registros do periodo</a>
          </li>
          <li>
            <a href="#resumos">
              Resumo
              <ol class="sublista">
                <li>
                  <a href="#resumo-semanal">Resumo semanal</a>
                </li>
                <li>
                  <a href="#resumo-mensal">Resumo mensal</a>
                </li>
              </ol>
            </a>
          </li>
        </ol>
      </section>

      <!-- REGISTROS -->
      <section id="registros">
        <h2>Registros do periodo</h2>
        
        <div class="cards-overview">
          <div class="card-stat">
            <label>Quantidade de Registros</label>
            <div class="valor">${dados.contagem_registros.qtd_registros}</div>
          </div>
          <div class="card-stat verde">
            <label>Média do Período</label>
            <div class="valor">${dados.media_periodo}</div>
          </div>
        </div>

        <div class="table-container">
          <table class="table-100">
            <thead>
              <tr>
                <th>Data</th>
                <th>Classificação</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${
                dados.registros_periodo.length
                  ? dados.registros_periodo
                      .map(
                        (registro) => `
                  <tr>
                    <td>${formatarData(registro.data_hora)}</td>
                    <td>${classificacoes[registro.classificacao]}</td>
                    <td>${registro.valor}</td>
                  </tr>
                  `,
                      )
                      .join("")
                  : templateTrSemRegistro
              }
              <tr class="resumo_registros">
                <td>Registro mais alto</td>
                <td>${formatarData(dados.registro_mais_alto.data_hora)}</td>
                <td>${dados.registro_mais_alto.media}</td>
              </tr>

              <tr class="resumo_registros">
                <td>Registro mais baixo</td>
                <td>${formatarData(dados.registro_mais_baixo.data_hora)}</td>
                <td>${dados.registro_mais_baixo.media}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- RESUMOS -->
      <section id="resumos">
        <h2>Resumo das medições</h2>
        
        <section id="resumo-semanal">
          <h3>Resumo semanal</h3>
          <div class="table-container">
            <table class="table-100">
              <thead>
                <tr>
                  <th>Nº da Semana</th>
                  <th>Média</th>
                  <th>Data de inicio</th>
                  <th>Data de Fim</th>
                  <th>Qtd. Registros</th>
                </tr>
              </thead>
              <tbody>
                ${
                  Object.keys(dados.medias_semanais).length
                    ? Object.keys(dados.medias_semanais)
                        .map(
                          (key) => `
                      <tr>
                        <td>
                          ${key.replace("_", " ").replace(key[0], key[0].toLocaleUpperCase())}
                        </td>
                        <td>
                          ${dados.medias_semanais[key].media}
                        </td>
                        <td>
                          ${dados.medias_semanais[key].data_inicio}
                        </td>
                        <td>
                          ${dados.medias_semanais[key].data_fim}
                        </td>
                        <td>
                          ${dados.medias_semanais[key].qtd_registros}
                        </td>
                      </tr>
                      `,
                        )
                        .join("")
                    : templateTrSemRegistro
                }
              </tbody>
            </table>
          </div>
        </section>

        <section id="resumo-mensal">
          <h3>Resumo mensal</h3>
          <div class="table-center">
            <table class="table-100">
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Média</th>
                  <th>Qtd. Registros</th>
                </tr>
              </thead>
              <tbody>
                ${
                  Object.keys(dados.medias_mensais).length
                    ? Object.keys(dados.medias_mensais)
                        .map(
                          (key) =>
                            `<tr>
                          <td>
                            ${meses[key.split("_")[2]]}
                          </td>
                          <td>
                            ${dados.medias_mensais[key].media}
                          </td>
                          <td>
                            ${dados.medias_mensais[key].qtd_registros}
                          </td>
                        </tr>
                      `,
                        )
                        .join("")
                    : `<tr><td colspan="3" style="text-align: center;">Sem registros</td></tr>`
                }
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  </div>
</body>
</html>
`;
}
