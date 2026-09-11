import GlicemiaRespository from "../repository/glicemia.repository.js"
import connectDB from "../database/db.js"

const glicemiaRespository = new GlicemiaRespository()
const camposObrigatorios = ["valor"];
export default class GlicemiaService{
    async Cadastrar(user,dados) {
        let db   
        try{
                const camposFaltando = camposObrigatorios.filter(campoObrigatorio => !dados[campoObrigatorio]) // {data_hora:valor }
                console.log(camposFaltando);
                if (
                    !user || !dados || camposFaltando.length
                ) {
                    const error = new Error()
                    error.camposFaltando = true;
                    error.message = `preencha os campos obrigatórios: ${camposFaltando.join(",")}`
                    throw error;
                }
                db = await connectDB()
                const [[result]] = await db.query("select meta_glicemia_pos from gestacao where id_usuario = ?", [user.id_usuario]);
                dados.classificacao = dados.valor > result.meta_glicemia_pos ?"A":dados.valor === result.meta_glicemia_pos ?"N":"B"; 
                const response = await glicemiaRespository.Cadastrar(user,dados,db);
                return{
                    mensagem:"glicemia cadastrada com sucesso :D"
                }
            } catch(error) {
            throw error;
            }
    }
} 