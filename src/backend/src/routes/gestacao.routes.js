import { Router } from "express";
import GestacaoControler from '../controllers/gestacao.controller.js';

const router = Router();
const gestacaoControler = new GestacaoControler();

router.get("/listar-gestacoes", gestacaoControler.ListarGestacoes());
router.get("/listar-gestacao/:id_gestacao", gestacaoControler.ListarGestacao());
router.post("/iniciar-gestacao", gestacaoControler.CriarGestacao());
router.delete("/remover-gestacao/:id_gestacao", gestacaoControler.RemoverGestacao());
router.patch("/finalizar-gestacao/:id_gestacao", gestacaoControler.FinalizarGestacao());
router.patch("/alterar-gestacao/:id_gestacao", gestacaoControler.AlterarGestacao());

export default router;