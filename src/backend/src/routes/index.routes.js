import { Router } from "express";
import UsuariosRoute from './usuarios.routes.js';
import AcompanhantesRoute from './acompanhantes.routes.js';
import AuthRoute from './auth.routes.js';
import { enviar } from "../utils/sendEmail.js";
import { gerarCodigo, validarCodigo } from "../utils/codigoValidacao.js";
const router = Router();

// As linhas abaixo básicamente dizem para que quando uma requisição for feita para o endpoint específicado
// para utilizar o router(ou a função) correspondente
router.use('/usuarios', UsuariosRoute);
router.use('/acompanhantes', AcompanhantesRoute);
router.use(`/glicemia`, GlicemiaRoute);
router.use('/auth', AuthRoute);

// Rota de teste
router.use('/teste-api', (req, res) => {
  res.status(200).json({
    status:"OK",
    mensagem:"Servidor rodando!"
  });
})


export default router;