import { Router } from "express";
import DiarioController from "../controllers/diario.controller.js";

const router = Router();
const diarioController = new DiarioController();

router.post("/cadastrar-refeicao", diarioController.CadastrarRefeicao());
router.get("/listar-refeicoes/usuario/:id_usuario", diarioController.ListarRefeicoes());
router.patch("/alterar-refeicao/:id_refeicao", diarioController.AlterarRefeicao());
router.delete("/remover-refeicao/:id_refeicao", diarioController.RemoverRefeicao());

export default router;