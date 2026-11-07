import { Router } from "express";
import DiarioController from "../controllers/diario.controller.js";
import { autenticar_acompanhante, autenticar_gestante } from "../utils/auth.js";

const router = Router();
const diarioController = new DiarioController();

router.post("/cadastrar-refeicao", autenticar_gestante, diarioController.CadastrarRefeicao());
router.get("/listar-refeicoes/usuario/:id_usuario", autenticar_gestante, diarioController.ListarRefeicoes());
router.get('/listar-refeicoes-acompanhante/:id_gestante', autenticar_acompanhante, diarioController.ListarDicasParaAcompanhante()); // Rota para listagem das refeições da gestante para o acompanhante
router.patch("/alterar-refeicao/:id_refeicao", autenticar_gestante, diarioController.AlterarRefeicao());
router.delete("/remover-refeicao/:id_refeicao",  autenticar_gestante, diarioController.RemoverRefeicao());

export default router;

