import { Router } from "express";
import DashboardController from '../controllers/dashboard.controller.js';
import { autenticar_acompanhante } from "../utils/auth.js";

const router = Router();
const dashboardController = new DashboardController();

router.get("/resumo", autenticar_acompanhante, dashboardController.Resumo());


export default router;