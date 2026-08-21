import nodemailer from 'nodemailer';
import configDotenv from './dotenv.js';

//Configuração de transporte dos emails
const transporter = nodemailer.createTransport({
  host:"smtp.gmail.com", // Para utilizar o gmail para envio dos emails
  port:465,
  secure:true, // Define se a conexão usa o certificado SSL, true se a porta for 465
  auth: {
    user:configDotenv.SMTP_USER,
    pass:configDotenv.SMTP_PASS,
  }
});

export default transporter;
