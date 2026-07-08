import {Router} from "express";
import { getProjetsController, getProjetByIdController, postProjetController} from "../controllers/projet.controller";

const router = Router();

router.get("/", getProjetsController);
router.get("/:id", getProjetByIdController);
router.post("/", postProjetController);

export default router;
