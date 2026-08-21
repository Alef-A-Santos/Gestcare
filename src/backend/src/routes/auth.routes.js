import { Router } from 'express';
import AuthController from "../controllers/auth.controller.js";
const router = Router();
const authController = new AuthController();

router.post("/login", authController.Logar());
router.get("/logout", authController.Deslogar());
router.post("/cadastrar-se", authController.Cadastrar());
router.post("/validar-codigo", authController.ValidarCodigo());
router.post("/reenviar-codigo", authController.ReenviarCodigo());

export default router;