import { Router } from "express";
import {
  postConnexionController,
  getUtilisateursController,
  getUtilisateurIdController,
  postUtilisateurController,
  putUtilisateurController,
  deleteUtilisateurController,
} from "../controllers/utilisateur.controller";

const router = Router();

router.post("/connexion", postConnexionController);
router.get("/", getUtilisateursController);
router.get("/:id", getUtilisateurIdController);
router.post("/", postUtilisateurController);
router.put("/:id", putUtilisateurController);
router.delete("/:id", deleteUtilisateurController);

export default router;
