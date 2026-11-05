import { Router } from "express";
import DiarioController from "../controllers/diario.controller.js";
import { autenticar_acompanhante, autenticar_gestante } from "../utils/auth.js";

const router = Router();
const diarioController = new DiarioController();

router.post("/cadastrar-refeicao", autenticar_gestante, diarioController.CadastrarRefeicao());
router.get("/listar-refeicoes/usuario/:id_usuario", autenticar_acompanhante, diarioController.ListarRefeicoes());
router.patch("/alterar-refeicao/:id_refeicao", autenticar_gestante, diarioController.AlterarRefeicao());
router.delete("/remover-refeicao/:id_refeicao",  autenticar_gestante, diarioController.RemoverRefeicao());

export default router;

