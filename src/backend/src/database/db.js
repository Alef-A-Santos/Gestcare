import mysql2 from 'mysql2/promise';
import configDotenv from '../config/dotenv.js';

const pools = new Map();
async function connectDB(){
  if(pools.has(configDotenv.DB_NAME)){
    return pools.get(configDotenv.DB_NAME);
  }

  try {
    const pool = await mysql2.createPool({
      host:configDotenv.DB_HOST,
      port: configDotenv.DB_PORT,
      user: configDotenv.DB_USER,
      password:configDotenv.DB_PASSWD,
      database: configDotenv.DB_NAME,
      connectTimeout: 3000
    })

    const db = await pool.getConnection();

    return db;
  }catch(err) {
    console.error(err);
    return null;
  }
}

export default connectDB;