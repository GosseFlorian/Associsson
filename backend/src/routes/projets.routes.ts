import {Router} from "express";
import { getProjetsController, getProjetByIdController} from "../controllers/projet.controller";

const router = Router();

router.get("/", getProjetsController);
router.get("/:id", getProjetByIdController);

export default router;
