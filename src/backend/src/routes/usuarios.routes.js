import { Router } from "express";
import  UsuariosController  from "../controllers/usuarios.controller.js";
import { autenticar_dev } from "../utils/auth.js";
import multer from "multer";

const upload = multer({limits:10 * 1024 * 5});
const usuariosController = new UsuariosController();
const router = Router();

router.get('/listar-usuarios', autenticar_dev ,usuariosController.Listar());
router.post('/cadastrar-usuario', autenticar_dev, usuariosController.Cadastrar());
router.delete('/deletar-usuario/:id', autenticar_dev, usuariosController.Deletar());
router.patch('/editar-usuario/:id', autenticar_dev, usuariosController.Atualizar());
router.post('/upload-foto', upload.single("foto_perfil"),usuariosController.UploadFoto());
// router.get('/buscar-foto/:caminho_foto', usuariosController.BuscarFoto());

export default router;