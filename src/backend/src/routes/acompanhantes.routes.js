import { Router } from "express";
import AcompanhantesController from '../controllers/acompanhantes.controller.js';

const router = Router();
const acompanhantesController = new AcompanhantesController(); 

router.get("/listar-acompanhantes", acompanhantesController.Listar());
router.get("/listar-acompanhantes-gestante", acompanhantesController.ListarAcompanhantesGestante());
router.post("/cadastrar-acompanhante", acompanhantesController.Cadastrar());
router.delete("/remover-acompanhante/:id", acompanhantesController.Remover());
router.patch("/editar-acompanhante/:id", acompanhantesController.Editar());

export default router;