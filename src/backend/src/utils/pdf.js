import puppeteer from "puppeteer";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { mkdir, open } from "fs";
import { rejects } from "assert";

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const dirBase = (subdiretorio) =>
  resolve(__dirname, "..", "..", "documentos", subdiretorio);

export async function GerarPdfTemplate(template, pdf_name) {
  const browser = await puppeteer.launch(); // Inicia um instância de um navegador
  const page = await browser.newPage(); // Inicia uma página no navegador
  await page.setContent(template, { waitUntil: "load" }); // Espera até que todos os conteúdos da página (template) sejam carregados

  const path = dirBase("pdfs"); // Obtém o caminho para o diretório

  const criado = await criarDiretorio(path); // cria o diretório, caso não exista

  if(!criado) {
    const error = new Error();
    error.dirFail = true;
    throw error;
  }

  const pdf_path = resolve(path, `${pdf_name}.pdf`); // o caminho para o pdf

  await page.pdf({
    path: pdf_path,
    format: "letter",
    printBackground: true,
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
  });

  return pdf_path;
}

export function criarDiretorio(diretorio) {
  return new Promise((resolve, reject) =>
    open(diretorio, (error, fd) => {
      if (error && error.code === "ENOENT") {
        // Cria o arquivo caso não exista(ENOENT == No Such File or Directory)
        // O segundo parâmetro diz para criar o diretório se não existir
        mkdir(diretorio, { recursive: true }, (err) => {
          if (err) reject(err);
          if (fd) fd.close();
        });
      } else if (error) {
        reject(error);
      }

      resolve(true);
    }),
  );
}
