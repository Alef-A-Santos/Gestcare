import { Router } from "express";
import DispositivosController from '../controllers/dispositivos.controller.js';
import { autenticar_gestante } from "../utils/auth.js";
const dispositivosController = new DispositivosController();
const router = Router();


router.get("/listar-dispositivos", autenticar_gestante, dispositivosController.Listar());
router.post("/cadastrar-dispositivo", autenticar_gestante, dispositivosController.Cadastrar());
router.put("/editar-dispositivo/:id", autenticar_gestante, dispositivosController.Editar());
router.delete("/deletar-dispositivo/:id", autenticar_gestante, dispositivosController.Deletar());
router.patch("/alterar-status/:id", autenticar_gestante, dispositivosController.AlterarStatus());


export default router;