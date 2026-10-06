import nodeschedule from "node-schedule";
import { EnviarLembrete } from "./lembretes.js";
import LembretesRepository from "../repository/lembretes.repository.js";
import UsuariosRepository from "../repository/usuarios.repository.js";

const usuariosRepository = new UsuariosRepository();
const lembretesRepository = new LembretesRepository();
const jobs = new Map();

export class JobsScheduler {
  async Criar(config, id, funcao, save) {
    const job = nodeschedule.scheduleJob(config, () => funcao());

    if (save) jobs.set(id, job);
    return true;
  }
  async Desativar(id) {
    const job = jobs.get(parseInt(id));
    if (job) {
      job.cancel();
      jobs.delete(id);

      return true;
    }

    return false;
  }
  async Editar(id, novaConfig, funcao) {
    const jobAtual = jobs.get(parseInt(id));
    if (jobAtual) {
      jobAtual.cancel();
    }
    const newJob = nodeschedule.scheduleJob(novaConfig, funcao);
    jobs.set(id, newJob);

    return true;
  }
  async IniciarJobsLembretes() {
    try {
      // Busca todos os lembretes ativos dos usuário ativos
      const lembretes = await lembretesRepository.ListarTodosAtivos();

      // Cria um job para cada um deles
      for (let lembrete of lembretes) {
        const user = { // Utilizado no util EnviarLembrete, para buscar todos os dispositivos do usuário
          id_usuario:lembrete.id_usuario
        }

        // Cria o job
        const job = nodeschedule.scheduleJob(
          JSON.parse(lembrete.config_node_schedule),
          async () =>
            await EnviarLembrete(lembrete.titulo, lembrete.categoria, user),
        );
        // Insere-o no map de Jobs
        jobs.set(lembrete.id_lembrete, job);
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
