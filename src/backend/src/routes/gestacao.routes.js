import { Router } from "express";
import GestacaoControler from '../controllers/gestacao.controller.js';
import { autenticar_acompanhante, autenticar_gestante } from "../utils/auth.js";

const router = Router();
const gestacaoControler = new GestacaoControler();

router.get("/listar-gestacoes", autenticar_gestante, gestacaoControler.ListarGestacoes());
router.get("/listar-gestacao/:id_gestacao", autenticar_acompanhante, gestacaoControler.ListarGestacao());
router.post("/iniciar-gestacao", autenticar_gestante, gestacaoControler.CriarGestacao());
router.delete("/remover-gestacao/:id_gestacao", autenticar_gestante, gestacaoControler.RemoverGestacao());
router.patch("/finalizar-gestacao/:id_gestacao", autenticar_gestante, gestacaoControler.FinalizarGestacao());
router.patch("/alterar-gestacao/:id_gestacao", autenticar_gestante, gestacaoControler.AlterarGestacao());

export default router;