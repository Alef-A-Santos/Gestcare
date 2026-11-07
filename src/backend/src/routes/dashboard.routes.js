import { Router } from "express";
import DashboardController from '../controllers/dashboard.controller.js';
import { autenticar_acompanhante, autenticar_gestante } from "../utils/auth.js";

const   router = Router();
const dashboardController = new DashboardController();

router.get("/resumo", autenticar_gestante, dashboardController.Resumo());
router.get("/resumo/:id_gestante", autenticar_acompanhante, dashboardController.ResumoAcompanhante());


export default router;