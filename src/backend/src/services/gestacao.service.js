import GestacaoRepository from "../repository/gestacao.repository.js";
import connectDB from "../database/db.js";

const gestacaoRepository = new GestacaoRepository();
const error = new Error();

export default class GestacaoService {
  async ListarGestacoes(user) {
    try {
      const gestacoes = await gestacaoRepository.ListarGestacoes(user);
      return gestacoes;
    } catch (error) {
      throw error;
    }
  }
  async ListarGestacao(id, user) {
    try {
      if (!id) {
        error.hasMissingValues = true;
        throw error;
      }

      const gestacao = await gestacaoRepository.ListarGestacao(id, user);

      if (!gestacao.length) {
        error.notFound = true;
        throw error;
      }

      return gestacao;
    } catch (error) {
      throw error;
    }
  }
  async CriarGestacao(dados, user) {
    let db;
    try {
      if (
        !dados ||
        (!dados.data_prev_parto && !dados.data_ultima_menstruacao)
      ) {
        error.hasMissingValues = true;
        throw error;
      }

      if (!dados.meta_glicemia_jejum || !dados.meta_glicemia_pos) {
        error.metasMissing = true;
        throw error;
      }

      db = await connectDB();
      if (dados.data_ultima_menstruacao) {
        const [[result]] = await db.query(
          `SELECT DATE_ADD(?,INTERVAL 9 MONTH) as data_prev_parto`,
          [dados.data_ultima_menstruacao],
        );
        console.log(result);
        dados.data_prev_parto = result.data_prev_parto;
      }

      const dados_gestacao = await gestacaoRepository.CriarGestacao(
        dados,
        user,
        db,
      );

      if (dados_gestacao.affectedRows === 0) {
        throw error;
      }

      return {
        mensagen: "Gestação cadastrada com sucesso!",
      };
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async RemoverGestacao(id_gestacao, user) {
    let db;
    try {
      if(!id_gestacao){
         error.hasMissingValues = true;
         throw error;
      }

      db = await connectDB();

      const result = await gestacaoRepository.RemoverGestacao(id_gestacao, user);

      if(result.affectedRows === 0){
         error.removeFail = true;
         throw error;
      }

      return {
         mensagen:"Gestação removida com sucesso!"
      }
    } catch (error) {
      throw error;
    } finally {
      if (db) db.release();
    }
  }
  async FinalizarGestacao(id_gestacao, user){
   try {
      if(!id_gestacao){
         error.hasMissingValues = true;
         throw error;
      }

      const response = await gestacaoRepository.FinalizarGestacao(id_gestacao, user);
       if(response.affectedRows === 0){
         error.finalizationFail = true;
         throw error;
      }

      return {
         mensagem:"Parabéns!A gestação foi finalizada com sucesso."
      }
   }catch(error) {
      throw error;
   }
  }
  async AlterarGestacao(id_gestacao, dados, user) {
   try {
      if(!id_gestacao) {
         error.hasMissingValues = true;
         throw error;
      }

      if(!dados){
         return {notModified:true, mensagem:"Nenhum dado alterado."};
      }

      const result = await gestacaoRepository.AlterarGestacao(id_gestacao, dados, user);

      if(result.affectedRows === 0) {
         error.updateFail = true;
         throw error;
      }

      return { mensagem: "Alterações salvas com sucesso!" };
   }catch(error){
      throw error;
   }
  }
}
