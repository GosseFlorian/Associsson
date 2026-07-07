import {Router} from "express";
import {getProjetsController, getProjetByIdController, createProjetController} from "../controllers/projet.controller";

const router = Router();

router.get("/", getProjetsController);
router.get("/:id", getProjetByIdController);
router.post("/", createProjetController);
export default router;
