import {Router} from "express";
import {getProjetsController, getProjetByIdController, createProjetController, updateProjetController} from "../controllers/projet.controller";

const router = Router();

router.get("/", getProjetsController);
router.get("/:id", getProjetByIdController);
router.post("/", createProjetController);
router.put("/id", updateProjetController)
export default router;
