import bcrypt from 'bcrypt';


export async function criptografar(dados) {
  try {
    const salt = await bcrypt.genSalt(10);
    const dadosCriptografado = await bcrypt.hash(dados,salt);
    return dadosCriptografado;
  }catch(err) {
    return err.message || "Falha na criptográfia dos dados";
  }
}

export function compararDados(dado, dadoEncriptado) {
  try {
    const isCorrect = bcrypt.compare(dado, dadoEncriptado);
    return isCorrect;
  }catch(err) {
    return error.message || "Falha na verificação dos dados!";
  }
}