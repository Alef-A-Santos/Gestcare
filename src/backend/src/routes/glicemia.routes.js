import GlicemiaController
 from "../controllers/glicemia.controller.js";
import {
    Router 
} from "express"
const router = Router();

const glicemiaController = new GlicemiaController ()

router.post("/cadastrar-glicemia", glicemiaController.Cadastrar());

export default router;