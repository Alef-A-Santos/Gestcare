import GlicemiaRespository from "../repository/glicemia.repository.js"

const glicemiaRespository = new GlicemiaRespository()

export default class GlicemiaService{
    async Cadastrar() {
            try{
                const response = glicemiaRespository.Cadastrar();
                res.status(200).send(response)
            } catch(error) {
                res.status(500).send({erro:error.message}) //Mensagem de Erro ao usuario
            }
    }
} 