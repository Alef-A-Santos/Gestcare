import GlicemiaRespository from "../repository/glicemia.repository.js"
import connectDB from "../database/db.js"

const glicemiaRespository = new GlicemiaRespository()
const camposObrigatorios = ["valor"];
export default class GlicemiaService{
    async Cadastrar(user,dados) {
        let db   
        try{
                const camposFaltando = camposObrigatorios.filter(campoObrigatorio => !dados[campoObrigatorio])
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

    async Listar(user) {
        let db
        try {
            if (!user) {
                const error = new Error("usuário não identificado")
                error.camposFaltando = true;
                throw error;
            }
            db = await connectDB()
            const glicemias = await glicemiaRespository.Listar(user, db);
            return { glicemias }
        } catch (error) {
            throw error;
        }
    }

    async Remover(user, id) {
        let db
        try {
            if (!user || !id) {
                const error = new Error("informe o id da glicemia")
                error.camposFaltando = true;
                throw error;
            }
            db = await connectDB()
            const result = await glicemiaRespository.Remover(user, id, db);
            if (result.affectedRows === 0) {
                const error = new Error("glicemia não encontrada")
                error.naoEncontrado = true;
                throw error;
            }
            return { mensagem: "glicemia removida com sucesso :D" }
        } catch (error) {
            throw error;
        }
    }
}