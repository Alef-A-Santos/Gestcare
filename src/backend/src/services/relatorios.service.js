import connectDB from "../database/db.js";
import RelatoriosRepository from "../repository/relatorios.repository.js";

const relatoriosRepository = new RelatoriosRepository();
const camposObrigatorios = ["data_inicio", "data_fim"];
const error = new Error();

export default class RelatoriosService {
  async Gerar(dados, user) {
    try {
      this.#VerificarCampos(dados);
      const response = await relatoriosRepository.Gerar(dados, user);
      return {
        response,
        mensagem: "Relatório gerado com sucesso!",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async CalcularMediaPeriodo(dados, user) {
    let db;
    try {
      this.#VerificarCampos(dados);
      db = await connectDB();
      const { media_periodo } = await relatoriosRepository.CalcularMediaPeriodo(dados, user, db);
      return {
        media_periodo,
        mensagem: "Média calculada com sucesso!",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }finally{
      if(db) db.release();
    }
  }
  async CalcularMediasSemanais(dados, user) {
    let db;
    try {
      this.#VerificarCampos(dados);
      db = await connectDB();
      const { medias } = await relatoriosRepository.CalcularMediasSemanais(dados, user, db);
      return {
        medias,
        mensagem: "Médias semanais calculadas com sucesso!",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }finally{
      if(db) db.release();
    }
  }
  async CalcularMediasMensais(dados, user) {
    let db;
    try {
      this.#VerificarCampos(dados);
      db = await connectDB();
      const { medias } = await relatoriosRepository.CalcularMediasMensais(dados, user, db);
      return {
        medias,
        mensagem: "Médias mensais calculadas com sucesso!",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }finally{
      if(db) db.release();
    }
  }

  #VerificarCampos(dados) {
    const camposFaltando = camposObrigatorios.filter(
        (campo) => !dados[campo],
      );
      if (!dados || camposFaltando.length) {
        error.camposFaltando = true;
        error.message = `Preencha os campos obrigatórios: ${camposFaltando.join(",")}`;
        throw error;
      }
  }
}
