import puppeteer from "puppeteer";
import { dirname, resolve } from 'path'
import { fileURLToPath } from "url";
import { mkdir, open,  } from "fs";
import { rejects } from "assert";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function GerarPdfTemplate (template, pdf_name) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(template, { waitUntil:"load" });
  const path = resolve(__dirname, "..", "..", "documentos", "pdfs");

  await criarDiretorio(path);

  const pdf_path = resolve(path, `${pdf_name}.pdf`);

  await page.pdf({
    path:pdf_path,
    format:"letter",
    printBackground:true,
    margin:{
      top:20,
      right:20,
      bottom:20,
      left:20,
    }
  })

  return pdf_path;
}

function criarDiretorio(diretorio) {
  return new Promise (
    (resolve, reject) => 
      open(diretorio, (error, fd) => {

        if(error && error.code === "ENOENT"){
          // Cria o arquivo caso não exista(ENOENT == No Such File or Directory)
          // O segundo parâmetro diz para criar o diretório se não existir
          mkdir(diretorio, { recursive:true } ,(err) => {
            if(err) reject(err);
            if(fd) fd.close()
          });
        } else if(error){
          reject(error);
        }
        resolve(true);
      })
  )
}
