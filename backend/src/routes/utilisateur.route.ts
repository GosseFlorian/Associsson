import { Router } from "express";
import {
  getUtilisateursController,
  getUtilisateurIdController,
  postUtilisateurController,
  putUtilisateurController,
} from "../controllers/utilisateur.controller";

const router = Router();

router.get("/", getUtilisateursController);
router.get("/:id", getUtilisateurIdController);
router.post("/", postUtilisateurController);
router.put("/:id", putUtilisateurController);

export default router;
