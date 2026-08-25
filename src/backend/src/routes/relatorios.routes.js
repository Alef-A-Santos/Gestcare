import { Router } from "express";
import RelatoriosController from '../controllers/relatorios.controller.js';

const router = Router();
const relatoriosController = new RelatoriosController();

router.get("/gerar-relatorio", relatoriosController.Gerar());


export default router;