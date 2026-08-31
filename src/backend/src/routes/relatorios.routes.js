import { Router } from "express";
import RelatoriosController from '../controllers/relatorios.controller.js';

const router = Router();
const relatoriosController = new RelatoriosController();

router.get("/gerar-relatorio", relatoriosController.Gerar());
router.get("/calcular-media-periodo", relatoriosController.CalcularMediaPeriodo());
router.get("/calcular-medias-semanais", relatoriosController.CalcularMediasSemanais());
router.get("/calcular-medias-mensais", relatoriosController.CalcularMediasMensais());


export default router;