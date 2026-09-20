import webpush from "web-push";
import configDotenv from "../config/dotenv.js";

// Configurando as VAPID Keys
// Essas keys são geradas apenas UMA única vez 
// console.log(dotenvConf.PUBLIC_VAPID_KEY, dotenvConf.PRIVATE_VAPID_KEY)
// Configurando as keys de identificação do servidor
webpush.setVapidDetails(
  "mailto:example@teste.com",
  configDotenv.VAPID_PUBLIC_KEY,
  configDotenv.VAPID_PRIVATE_KEY,
);

export const sendPush = async (subscription, data) => {
  try {
    const notified = await webpush.sendNotification(subscription, data);
    return true;
  }catch(error){
    throw error;
  }
}