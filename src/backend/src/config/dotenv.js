import dotenv from 'dotenv'; // Para acessar as variáveis de ambiente do arquivo .env

dotenv.config();

const configDotenv = {
    PORT:process.env.PORT || 3000,
    DB_HOST: process.env.DB_HOST || 3306,
    DB_USER: process.env.DB_USER,
    DB_PASSWD: process.env.DB_PASSWD,
    DB_PORT: process.env.DB_PORT,
    DB_NAME:process.env.DB_NAME,
    VERSION:process.env.VERSION,
    JWT_SECRET:process.env.JWT_SECRET,
    SMTP_USER:process.env.SMTP_USER,
    SMTP_PASS:process.env.SMTP_PASS,
    APP_FRONT_URL:process.env.APP_FRONT_URL
}

if( !configDotenv.DB_HOST 
   || !configDotenv.DB_USER 
     || !configDotenv.DB_PASSWD 
    || !configDotenv.DB_PORT 
    || !configDotenv.DB_NAME
    || !configDotenv.JWT_SECRET
    || !configDotenv.SMTP_USER
    || !configDotenv.SMTP_PASS
    || !configDotenv.APP_FRONT_URL
){
    console.error(`Alguma das variáveis de ambiente não foram definidas! Por favor olhe o seu arquivo \x1b[33m.env\x1b[0m`);
}

export default configDotenv;