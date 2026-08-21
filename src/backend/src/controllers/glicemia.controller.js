import GlicemiaService from "../services/glicemia.service.js"

const glicemiaService = new GlicemiaService()

export default class GlicemiaController{
    Cadastrar() {
        return (req,res)=>{
            try{
                const response = glicemiaService.Cadastrar();
                res.status(200).send(response)
            } catch(error) {
                res.status(500).send({erro:error.message}) //Mensagem de Erro ao usuario
            }
        }
    }
}