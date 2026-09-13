import { Router } from "express";
import RelatoriosController from '../controllers/relatorios.controller.js';
import { autenticar_gestante } from "../utils/auth.js";

const router = Router();
const relatoriosController = new RelatoriosController();

router.get("/gerar-relatorio", autenticar_gestante, relatoriosController.Gerar());
router.get("/calcular-media-periodo", autenticar_gestante, relatoriosController.CalcularMediaPeriodo());
router.get("/calcular-medias-semanais", autenticar_gestante, relatoriosController.CalcularMediasSemanais());
router.get("/calcular-medias-mensais", autenticar_gestante, relatoriosController.CalcularMediasMensais());


export default router;