import { open, writeFile } from "fs"
import *as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const caminhoBase = path.resolve(__dirname, "..", "..", "documentos");

export function Upload(caminho, content) {
  return new Promise((resolve, reject) => {
    writeFile(path.resolve(caminhoBase, caminho), content, (err) =>{
      if(err) reject(err);
      resolve(true);
    });
  })
}