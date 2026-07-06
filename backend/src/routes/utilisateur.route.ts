import { Router } from "express";
import { getUtilisateursController, getUtilisateurIdController, postUtilisateurController, patchUtilisateurController } from "../controllers/utilisateur.controller";

const router = Router();

router.get("/", getUtilisateursController);
router.get("/:id", getUtilisateurIdController);
router.post("/", postUtilisateurController);
router.patch("/:id", patchUtilisateurController);

export default router;
