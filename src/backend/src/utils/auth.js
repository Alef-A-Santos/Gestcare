import jsonwebtoken from "jsonwebtoken";
import configDotenv from "../config/dotenv.js";

function autenticarUsuario(perfisAutorizados, req, res, next) {
  try {
    const token = req.cookies.jwt_tkn;
    if (!token) {
      return res.status(401).send({ erro: "Autenticação necessária!" });
    }

    const decoded = jsonwebtoken.decode(token);
    
    if (!perfisAutorizados.includes(decoded.perfil)) {
      return res.status(403).send({ erro: "Ação não autorizada!" });
    }

    req.user = {
      id_usuario: decoded.id_usuario,
      nome: decoded.nome,
      email: decoded.email,
      perfil: decoded.perfil,
    };
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({ erro: "Falha no servidor!" });
  }
}

const privilegioAlto = ['dev'];
const privilegioMedio = [...privilegioAlto, 'gestante'];
const privilegioBaixo = [...privilegioAlto, ...privilegioMedio, 'acompanhante'];

export const autenticar_dev = (req, res, next) =>
  autenticarUsuario(privilegioAlto, req, res, next);
export const autenticar_gestante = (req, res, next) =>
  autenticarUsuario(privilegioMedio, req, res, next);
export const autenticar_acompanhante = (req, res, next) =>
  autenticarUsuario(privilegioBaixo, req, res, next);

export async function gerarToken(dados) {
  const payload = {
    id_usuario: dados.id_usuario,
    nome: dados.nome,
    email: dados.email,
    perfil: dados.perfil,
  };

  try {
    const token = jsonwebtoken.sign(payload, configDotenv.JWT_SECRET, {
      expiresIn: "30 days", //Token expira em 30 dias, assim como o cookie
    });

    return token;
  } catch (error) {
    console.error(error);
    return { erro: "Falha ao gerar token!" };
  }
}
