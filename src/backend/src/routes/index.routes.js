import { Router } from "express";
import GlicemiaRoutes from './glicemia.routes.js';
import UsuariosRoutes from './usuarios.routes.js';
import AcompanhantesRoutes from './acompanhantes.routes.js';
import AuthRoutes from './auth.routes.js';
import RelatorioRoutes from './relatorios.routes.js';
import DispositivosRoutes from './dispositivos.routes.js';
import { enviar } from "../utils/sendEmail.js";
import { gerarCodigo, validarCodigo } from "../utils/codigoValidacao.js";
const router = Router();

// As linhas abaixo básicamente dizem para que quando uma requisição for feita para o endpoint específicado
// para utilizar o router(ou a função) correspondente
router.use('/usuarios', UsuariosRoutes);
router.use('/acompanhantes', AcompanhantesRoutes);
router.use(`/glicemia`, GlicemiaRoutes);
router.use('/auth', AuthRoutes);
router.use('/relatorio', RelatorioRoutes);
router.use('/dispositivos', DispositivosRoutes);

// Rota de teste
router.use('/teste-api', (_, res) => {
  res.status(200).json({
    status:"OK",
    mensagem:"Servidor rodando!"
  });
})

export default router;