import { Router } from "express";
import AcompanhantesController from '../controllers/acompanhantes.controller.js';
import { autenticar_gestante } from "../utils/auth.js";

const router = Router();
const acompanhantesController = new AcompanhantesController(); 

router.get("/listar-acompanhantes", autenticar_gestante, acompanhantesController.Listar());
router.get("/listar-acompanhantes-gestante", acompanhantesController.ListarAcompanhantesGestante());
router.post("/cadastrar-acompanhante", autenticar_gestante, acompanhantesController.Cadastrar());
router.delete("/remover-acompanhante/:id", autenticar_gestante, acompanhantesController.Remover());
router.patch("/editar-acompanhante/:id", autenticar_gestante, acompanhantesController.Editar());

export default router;