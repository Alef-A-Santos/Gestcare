import LembretesRepository from "../repository/lembretes.repository.js";
import { EnviarLembrete } from "../utils/lembretes.js";
import connectDB from "../database/db.js";
import { JobsScheduler } from "../utils/nodeSchedule.js";
import { criarConfig } from "../utils/criarConfig.js";
import DispositivosRepository from "../repository/dispositivos.repository.js";

const lembretesRepository = new LembretesRepository();
const dispositivosRepository = new DispositivosRepository();

const jobsScheduler = new JobsScheduler();
const error = new Error();
const camposObrigatorios = [
  "recorrencia",
  "horario_fixo",
  "titulo",
  "categoria",
];

export default class LembretesService {
  async ListarLembretesUsuario(user) {
    const response = await lembretesRepository.ListarLembretesUsuario(user);
    return { lembretes:response };
  }
  async Criar(user, dados) {
    let db;
    try {
      const missing = camposObrigatorios.filter((campo) => !dados[campo]);
      if (
        !Object.keys(dados).length ||
        missing.length ||
        !dados.recorrencia ||
        (typeof dados.recorrencia === "object" && !dados.horario)
      ) {
        error.hasMissingValues = true;
        const message = missing.length
          ? `Preencha os campos: ${missing.join(",")}`
          : "Preeencha os campos obrigatórios ou informe um horário para a data.";
        error.message = message;

        throw error;
      }

      const dispositivos = await dispositivosRepository.ListarDispositivosUsuario(user);
      if(!dispositivos.length) {
        error.notFound = true;
        error.message = "Você não possuí dispositivos cadastrados!";
        throw error;
      }

      // Inicia a conexão com o banco
      // e uma Transaction para reverter as alterações feitas em caso de error
      db = await connectDB();
      db.beginTransaction();

      // Chama a função para criar a config cron utilizada no node-schedule
      const config = criarConfig(
        dados.horario,
        dados.recorrencia,
        dados.periodicamente,
        dados.horario_fixo,
      );

      // Cria o lembrete no banco
      const response = await lembretesRepository.Criar(user, dados, config, db);

      // Cria o job
      const jobCreated = await jobsScheduler.Criar(
        config,
        response.insertId,
        ()=>this.#enviar(dados.titulo, dados.categoria, user),
        true, // Parâmetro para salvar o job no map
      );

      if (!jobCreated) {
        error.notCreated = true;
        error.message = "Falha ao criar lembrete!";
        throw error;
      }

      if (typeof dados.recorrencia === "string" && !dados.periodicamente) {
        const desativar = async () => {
          await this.#desativarJob(response.insertId);
          const result = await lembretesRepository.AlterarStatusLembrete(
            user,
            response.insertId,
            0,
            db,
          );
        };
        const jobDelecao = jobsScheduler.Criar(
          {
            ...config,
            minute: config.minute + 10 % 60,
          },
          "temp",
          desativar,
        );
      }

      db.commit();
      return { mensagem: "Lembrete criado com sucesso!" };
    } catch (error) {
      if (db) db.rollback();
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async AlterarStatus(id, user, status) {
    let db;
    try {
      db = await connectDB();

      const [[lembrete]] = await db.query(`SELECT COUNT(id_lembrete) as qtd_lembrete FROM lembretes WHERE id_lembrete = ? AND id_usuario = ?`,[
        id, user.id_usuario
      ]);

      if(!lembrete.qtd_lembrete) {
        error.notFound = true;
        error.message = "Lembrete  não encontrado!";
        throw error;
      }

      const response = await lembretesRepository.AlterarStatusLembrete(id, user, status, db);

      status == 0?this.#desativarJob(id):this.#recriarJob(id, user);

      return { mensagem: "Status alterado com sucesso!"};
    }catch(error) {
      throw error;
    }finally { 
      if(db) db.release();
    }
  }
  async Deletar(id, user) {
    const response = await lembretesRepository.Deletar(id, user);
    this.#desativarJob(id);
    if(response.affectedRows == 0) {
      throw error;      
    }
    return { mensagem: "Lembrete deletado com sucesso!" };
  }
  async Editar(id, user, dados) {
    let db,
    novaConfig;
    try {
      const camposConfig = ["horario","recorrencia","periodicamente","horario_fixo"];
      if(!dados || !Object.keys(dados)){
        error.hasMissingValues = true;
        error.message = "Insra os campos para alteração!";
        throw error;
      }

      db = await connectDB();
      db.beginTransaction();
      const [[exist]] = await db.query(`SELECT count(id_lembrete) as qtd FROM lembretes WHERE id_lembrete = ? AND id_usuario = ?`,[
        id, user.id_usuario
      ]);

      if(!exist.qtd){
        error.notFound = true;
        error.message = "Lembrete  não encontrado!";
        throw error;
      }

      const hasCamposConfig = camposConfig.some((campo) => dados[campo]);
      if(hasCamposConfig){
        novaConfig = criarConfig(
          dados.horario,
          dados.recorrencia,
          dados.periodicamente,
          dados.horario_fixo,
        );
      }

      const lembreteAtualizado = await lembretesRepository.Editar(id, user, dados, novaConfig, db);
      if(!lembreteAtualizado || !Object.keys(lembreteAtualizado)){
        error.fail = true;
        error.message = "Falha ao editar lembrete!Tente novamente mais tarde.";
        throw error;
      }

      if(novaConfig) {
        const editado = jobsScheduler.Editar(id, novaConfig, () => this.#enviar(lembreteAtualizado.titulo, lembreteAtualizado.categoria, user));
      }

      db.commit();
      return {
        mensagem:"Lembrete editado com sucesso!"
      }
    }catch(error) {
      if(db) db.rollback();
      throw error;
    }finally{
      if(db) db.release();
    }
  }

  // Função de desativação do job
  #desativarJob(id) {
    const desativada = jobsScheduler.Desativar(id);
    return desativada;
  }
  // Função para recriação do job
  async #recriarJob(id, user) {
    const lembrete = await lembretesRepository.BuscarPorId(id);
    const config  = JSON.parse(lembrete.config_node_schedule);
    return jobsScheduler.Criar(config, id, () => this.#enviar(lembrete.titulo, lembrete.categoria, user), true)
  }
  // Função de envio
  async #enviar(titulo, categoria, user){
    return await EnviarLembrete(titulo, categoria, user);
  } 
}
