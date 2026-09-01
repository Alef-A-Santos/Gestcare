import http from 'http'; // Biblioteca para abrir o servidor
import express from 'express'; // Para manipulação de rotas
import bodyParser from 'body-parser'; // Biblioteca para permitir a leitura dos dados vindos no body da requisição
import cookieParser from 'cookie-parser'; // Biblioteca para manipulação de cookies
import cors from 'cors'; // Biblioteca para configuração de CORS
// import dotenv from 'dotenv'; // Para acessar as variáveis de ambiente do arquivo .env
import morgan from 'morgan'; // Logs das requisições

import indexRoute from './src/routes/index.routes.js';
import configDotenv from './src/config/dotenv.js';

const app = express();

app.use(cors({
  origin:configDotenv.APP_FRONT_URL,
  credentials:true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Todas as requisições vindas para endpoint /api serão direcionadas para o index router
app.use('/api', indexRoute);
// Em caso do endpoint requisitado não corresponder com os registrados
app.use((_, res)=>{
  return res.status(404).send({erro:"Endpoint não encontrado!"});
});

const server = http.createServer(app);

const gestcareASCII = `
|   ██████╗ ███████╗███████╗████████╗ ██████╗ █████╗ ██████╗ ███████╗ |
|  ██╔════╝ ██╔════╝██╔════╝╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔════╝ |
|  ██║  ███╗█████╗  ███████╗   ██║   ██║     ███████║██████╔╝█████╗   |
|  ██║   ██║██╔══╝  ╚════██║   ██║   ██║     ██╔══██║██╔══██╗██╔══╝   |
|  ╚██████╔╝███████╗███████║   ██║   ╚██████╗██║  ██║██║  ██║███████╗ |
|   ╚═════╝ ╚══════╝╚══════╝   ╚═╝    ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ | 
`

app.listen(configDotenv.PORT, () => {
  console.log('\x1b[34m' + '━'.repeat(71) + '\x1b[0m');
  console.log(`\x1b[36m${gestcareASCII}\x1b[0m`);
  console.log('\x1b[34m' + '━'.repeat(71) + '\x1b[0m');
  console.log(`\x1b[36m|\x1b[0m  Server rodando na porta: \x1b[34m${configDotenv.PORT} \x1b[36m${' '.repeat(37)}|\x1b[0m`);
  console.log(`\x1b[36m|\x1b[0m  Banco  rodando na porta: \x1b[34m${configDotenv.DB_PORT} \x1b[36m${' '.repeat(37)}|\x1b[0m`);
  console.log(`\x1b[36m|\x1b[0m  Banco utilizado: \x1b[34m${configDotenv.DB_NAME} \x1b[36m${' '.repeat(38)}|\x1b[0m`);
  console.log('\x1b[34m' + '━'.repeat(71) + '\x1b[0m');
});