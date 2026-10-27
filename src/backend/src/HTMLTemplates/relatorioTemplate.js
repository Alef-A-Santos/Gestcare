import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

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

const formatarData = (data) =>
  Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);

export function gerarTemplateRelatorio(dados) {
  return `
  <!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Template</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
    }

    body{
      color: #00080A;
    }

    header{
      padding: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: center;
    }

    .imagem-container{
      width: 100px;
      height: 100px;
      align-content: center;
    }
    img{
      width: 100%;
    }

    main{
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .sumario{
      padding: 10px;
    }

    .sumario .items {
      padding-left: 20px;
    }

    .items a {
      text-decoration: none;
      color: inherit;
    }

    .sublista{
      padding-left: 10px;
    }

    section {
      display:flex;
      flex-direction:column;
      gap:15px;
    }

    .geral{
      color: #202226;
    }

    table{
      border-collapse: collapse;
    }
  
    .table-100{
      width: 100%;
    }

    .table-center{
      width: 100%;
      display: flex;
      justify-content: center;
    }


    th{
      background-color: #080808;
      color: #f7f7f7;
    }

    tr, th, td{
      padding: 5px;
      border: 1px solid rgb(36, 33, 33);
    }

    tbody tr:nth-child(odd) {
      background-color: #e6e3e3;
    }

    .resumo_registros{
      background-color: #080808 !important;
      color: #f7f7f7;
    }
  </style>
</head>
<body>
  <header>
    <div class="imagem-container">
      <img src="data:image/png;base64,${imagemBase64}" alt="Logo gestcare">
    </div>
    <div class="content-header">
      <h1>Relatório de medições</h1>
      <p>${dados.nome_gestante}</p>
      <p>${dados.periodo}</p>
    </div>
  </header>
  <main>
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
    <section id="registros">
      <h2>Registros do periodo</h2>
      <p class="geral">
        <strong>Quantidade de registros: </strong>
        ${dados.contagem_registros.qtd_registros}
      </p>
      <p class="geral">
        <strong>Média do período: </strong>
        ${dados.media_periodo}
      </p>
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
              <td>
              ${dados.registro_mais_alto.media}
              </td>
            </tr>

            <tr class="resumo_registros">
              <td >Registro mais baixo</td>
              <td>${formatarData(dados.registro_mais_alto.data_hora)}</td>
              <td>
                ${dados.registro_mais_baixo.media}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <section id="resumos">
      <h2>Resumo das medições</h2>
      <section id="resumo-semanal">
        <h3>Resumo semanal</h3>
        <div>
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
                  : `<tr colspan="2"><td>Sem registros</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </section>
    </section>
  </main>
</body>
</html>
`;
}
