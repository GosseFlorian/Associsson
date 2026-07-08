import {Router} from "express";
import { getProjetsController, getProjetByIdController, postProjetController} from "../controllers/projet.controller";

const router = Router();


router.get("/", getProjetsController);
router.get("/:id", getProjetByIdController);
router.post("/", postProjetController);
<<<<<<< HEAD
=======

>>>>>>> e7d09146ba55132efcdbb61b34ae53a9b46ccbb4
export default router;
