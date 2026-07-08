import {Router} from "express";
import {postProjetController} from "../controllers/projet.controller";

const router = Router();

router.post("/", postProjetController);
export default router;
