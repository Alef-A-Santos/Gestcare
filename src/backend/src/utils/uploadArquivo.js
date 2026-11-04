import { open, writeFile } from "fs"

export function Upload(caminho, content) {
  return new Promise((resolve, reject) => {
    writeFile(caminho, content, (err) =>{
      console.log(err)
      if(err) reject(err);
      resolve(true);
    });
  })
}