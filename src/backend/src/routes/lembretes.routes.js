import { Router } from 'express';
import LembretesController from '../controllers/lembretes.controller.js';
import { autenticar_gestante } from '../utils/auth.js';

const lembretesController = new LembretesController();

const router = Router();

router.get("/listar-lembretes-usuario", autenticar_gestante, lembretesController.ListarLembretesUsuario());
router.post("/criar-lembrete", autenticar_gestante, lembretesController.Criar());
router.patch("/alterar-status-lembrete/:id", autenticar_gestante, lembretesController.AlterarStatus());
router.delete("/deletar-lembrete/:id", autenticar_gestante, lembretesController.Deletar());
router.put("/editar-lembrete/:id", autenticar_gestante, lembretesController.Editar());

export default router;