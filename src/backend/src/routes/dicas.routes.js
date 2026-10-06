import { Router } from "express";
import DicasController from '../controllers/dicas.controller.js';

const router = Router();
const dicasController = new DicasController();

router.get("/listar-dicas", dicasController.ListarDicas());
router.get("/listar-dicas/categoria/:categoria", dicasController.ListarDicasPorCategoria());
// router.get("/listar-dicas/usuario/:id_usuario", dicasController.ListarDicasPorUsuario());
router.post("/criar-dica", dicasController.CriarDica());
router.patch("/alterar-dica/:id_dica", dicasController.AlterarDica());
router.patch("/vincular-link-dica/:id_dica", dicasController.VincularLinkDica());
router.delete("/remover-dica/:id_dica", dicasController.RemoverDica());

export default router;