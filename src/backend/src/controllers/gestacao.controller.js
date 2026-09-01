import GestacaoService from '../services/gestacao.service.js';

const mensagemErroInterno = "Erro interno no servidor!";
const gestacaoService = new GestacaoService();

export default class GestacaoController{
   ListarGestacoes(){
      return async (req, res) => {
         try{
            const { user } = req.body;
            const response = await gestacaoService.ListarGestacoes(user);
            return res.status(200).send(response);
         }catch(error){
            return res.status(500).send({erro:mensagemErroInterno});
         }
      }
   }
   ListarGestacao(){
      return async (req, res) => {
         try {
            console.log(req.params)
            const { id_gestacao } = req.params;
            // const { user } = req;
            const { user } = req.body;
            const response = await gestacaoService.ListarGestacao(id_gestacao, user);
            return res.status(200).send(response);
         }catch(error){
            console.error(error);
            if(error.hasMissingValues){
               return res.status(400).send({erro:"Gestação não informada!"});
            }

            if(error.notFound){
               return res.status(404).send({erro:"Gestação não encontrada!"});
            }

            return res.status(500).send({erro:mensagemErroInterno});
         }
      }
   }
   CriarGestacao(){
      return async (req, res) =>{
         try {
            const { dados, user } = req.body;
            const response = await gestacaoService.CriarGestacao(dados, user);
            res.status(201).send(response);
         }catch(error){
            console.error(error);
            if(error.hasMissingValues || error.metasMissing){
               let mensagemErro = "Informe a data prevista do parto ou a data da ultima menstruação para o cálculo da data!";
               if(error.metasMissing) {
                  mensagemErro = "Informe as metas de glicemia em jejum e pos!";
               }
               return res.status(400).send({erro:mensagemErro});
            }
            res.status(500).send({erro:mensagemErroInterno});
         }
      }
   }
   RemoverGestacao(){
      return async (req, res) => {
         try {
            console.log(req.params)
            const { id_gestacao } = req.params;
            const { user } = req.body;
            const response = await gestacaoService.RemoverGestacao(id_gestacao, user);
            return res.status(200).send(response);
         }catch(error) {
            console.error(error);
            let mensagemErro = mensagemErroInterno;

            if(error.removeFail){
               mensagemErro = "Falha interna ao remover gestacao!";
            }

            if(error.notFound) {
               return res.status(404).send({erro:"Gestação não encontrada!"});
            }

            if(error.hasMissingValues){
               return res.status(400).send({erro:"Informe a gestação para ser deletada!"});
            }

            return res.status(500).send({erro:mensagemErro});
         }
      }
   }
   FinalizarGestacao(){
      return async (req, res) => {
         try{
            const { id_gestacao } = req.params;
            const { user } = req.body;
            const response = await gestacaoService.FinalizarGestacao(id_gestacao, user);
            return res.status(200).send(response);  
         }catch(error) {
            console.error(error);

            let mensagemErro = mensagemErroInterno;
         
            if(error.hasMissingValues){
               return res.status(400).send({erro:"Informe a gestação que será deletada!"});
            }

            if(error.finalizationFail){
               mensagemErro = "Falha interna ao finalizar gestacao!";
            }

            return res.status(500).send({erro:mensagemErro});
         }
      }
   }
   AlterarGestacao(){
      return async (req, res) => {
         try{
            const { id_gestacao }= req.params;
            const { dados, user }= req.body;
            const response = await gestacaoService.AlterarGestacao(id_gestacao, dados, user);

            if(response.noModified){
               return res.status(304).send(response.mensagem);
            }
            return res.status(200).send(response);
         }catch(error){
            console.error(error);
            let mensagemErro = mensagemErroInterno;
            if(error.hasMissingValues){
               return res.status(400).send({erro:"Informe a gestação que para alteração!"});
            }
            if(error.updateFail) {
               mensagemErro = "Falha interna ao alterar registros! Tente novamente mais tarde."
            }
            res.status(500).send({erro:mensagemErro});
         }
      }
   }
}