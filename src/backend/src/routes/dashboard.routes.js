import { Router } from "express";
import DashboardController from '../controllers/dashboard.controller.js';

const router = Router();
const dashboardController = new DashboardController();

router.get("/resumo", dashboardController.Resumo());


export default router;