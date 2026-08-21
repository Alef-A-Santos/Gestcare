import jsonwebtoken from 'jsonwebtoken';
import configDotenv from '../config/dotenv.js';

export async function gerarToken(dados) {
  const payload = {
    id:dados.id,
    nome:dados.nome,
    email:dados.email,
    perfil:dados.perfil,
  };

  try {
    const token = jsonwebtoken.sign(payload, configDotenv.JWT_SECRET, {
      expiresIn:"30 days" //Token expira em 30 dias, assim como o cookie
    });

    return token;
  }catch(error) {
    console.error(error)
    return {erro:"Falha ao gerar token!"};
  }
}