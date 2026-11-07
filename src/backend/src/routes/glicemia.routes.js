import GlicemiaController
 from "../controllers/glicemia.controller.js";
import {
    Router 
} from "express"
import { autenticar_acompanhante, autenticar_gestante } from "../utils/auth.js";
const router = Router();

const glicemiaController = new GlicemiaController ()

router.post("/cadastrar-glicemia", autenticar_gestante, glicemiaController.Cadastrar());
router.get("/listar-glicemia", autenticar_acompanhante, glicemiaController.Listar());
router.get("/listar-glicemia/:id_gestante", autenticar_acompanhante, glicemiaController.ListarParaAcompanhante());
router.delete("/remover-glicemia/:id", autenticar_gestante, glicemiaController.Remover());

export default router;