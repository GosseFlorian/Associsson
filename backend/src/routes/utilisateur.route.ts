import { Router } from "express";
import { getUtilisateursController } from "../controllers/utilisateur.controller";

const router = Router();

router.get("/", getUtilisateursController);

export default router;
