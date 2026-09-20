import nodeschedule from 'node-schedule';
import { EnviarLembrete } from './lembretes.js';

const jobs = new Map();


export class JobsScheduler {
  async Criar(config, id, funcao, save){
    const job = nodeschedule.scheduleJob(config, () => funcao())
    
    if(save) jobs.set(id, job);
    return true;
  }
  async Desativar(id) {
    const job = jobs.get(parseInt(id));
    if(job){
      job.cancel();
      jobs.delete(id);
  
      return true;
    }

    return false;
  }
  async Editar(id, novaConfig, funcao) {
    const jobAtual = jobs.get(parseInt(id));
    if(jobAtual) {
      jobAtual.cancel();
    }
      const newJob = nodeschedule.scheduleJob(novaConfig, funcao);
      jobs.set(id, newJob);

    return true;
  }
}