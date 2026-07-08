import {Router} from "express";
import { 
    getProjetsController, 
    getProjetByIdController, 
    postProjetController,
    putProjetController,
} from "../controllers/projet.controller";

const router = Router();


router.get("/", getProjetsController);
router.get("/:id", getProjetByIdController);
router.post("/", postProjetController);
router.put("/:id", putProjetController);
export default router;
