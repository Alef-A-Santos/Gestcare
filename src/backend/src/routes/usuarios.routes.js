import { Router } from "express";
import  UsuariosController  from "../controllers/usuarios.controller.js";
import { autenticar_dev } from "../utils/auth.js";

const usuariosController = new UsuariosController();
const router = Router();

router.get('/listar-usuarios', autenticar_dev ,usuariosController.Listar());
router.post('/cadastrar-usuario', autenticar_dev, usuariosController.Cadastrar());
router.delete('/deletar-usuario/:id', autenticar_dev, usuariosController.Deletar());
router.patch('/editar-usuario/:id', autenticar_dev, usuariosController.Atualizar());

export default router;