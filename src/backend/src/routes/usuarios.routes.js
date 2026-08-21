import { Router } from "express";
import  UsuariosController  from "../controllers/usuarios.controller.js";

const usuariosController = new UsuariosController();
const router = Router();

router.get('/listar-usuarios', usuariosController.Listar());
router.post('/cadastrar-usuario', usuariosController.Cadastrar());
router.delete('/deletar-usuario/:id', usuariosController.Deletar());
router.patch('/editar-usuario/:id', usuariosController.Atualizar());

export default router;