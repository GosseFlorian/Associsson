import {Router} from "express";
import { getProjetByIdController} from "../controllers/projet.controller";

const router = Router();

router.get("/:id", getProjetByIdController);

export default router;
