import DispositivosRepository from "../repository/dispositivos.repository.js";
import LembretesRepository from "../repository/lembretes.repository.js";
import { sendPush } from "./sendPush.js";

const lembretesRepository = new LembretesRepository();
const dispositivosRepository = new DispositivosRepository();

export async function EnviarLembrete(titulo, categoria, user) {
  try {
    const dispositivos = await dispositivosRepository.ListarAtivosPorIdUsuario(user);
    for await (let dispositivo of dispositivos) {
      const sended = await sendPush(dispositivo, JSON.stringify({
        titulo, categoria
      })) 

      if(!sended){
        throw new Error("Falha ao enviar notificação!");
      }
    }

    return true;
  }catch(error){
    throw error;
  }
}