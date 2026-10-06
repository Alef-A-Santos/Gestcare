import GlicemiaController
 from "../controllers/glicemia.controller.js";
import {
    Router 
} from "express"
import { autenticar_gestante } from "../utils/auth.js";
const router = Router();

const glicemiaController = new GlicemiaController ()

router.post("/cadastrar-glicemia", autenticar_gestante, glicemiaController.Cadastrar());

export default router;