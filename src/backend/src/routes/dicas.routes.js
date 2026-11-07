import { Router } from "express";
import DicasController from '../controllers/dicas.controller.js';
import { autenticar_acompanhante, autenticar_gestante } from "../utils/auth.js";

const router = Router();
const dicasController = new DicasController();

router.get("/listar-dicas", autenticar_gestante, dicasController.ListarDicas());
router.get("/listar-dicas-acompanhante/:id_gestante", autenticar_acompanhante, dicasController.ListarDicasParaAcompanhante()); // Rota utilizada pelo ACOMPANHANTE para listagem das dicas
router.get("/listar-dicas/categoria/:categoria", autenticar_acompanhante, dicasController.ListarDicasPorCategoria());
// router.get("/listar-dicas/usuario/:id_usuario", dicasController.ListarDicasPorUsuario());
router.post("/criar-dica", autenticar_gestante, dicasController.CriarDica());
router.patch("/alterar-dica/:id_dica", autenticar_gestante, dicasController.AlterarDica());
router.patch("/vincular-link-dica/:id_dica", autenticar_gestante, dicasController.VincularLinkDica());
router.delete("/remover-dica/:id_dica", autenticar_gestante, dicasController.RemoverDica());

export default router;