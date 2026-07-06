import { Router } from "express";
import { getUtilisateursController, getUtilisateurIdController } from "../controllers/utilisateur.controller";

const router = Router();

router.get("/", getUtilisateursController);
router.get("/:id", getUtilisateurIdController);

export default router;
