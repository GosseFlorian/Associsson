import {Router} from "express";
import {
    getProjetsController
} from "../controllers/projet.controller";

const router = Router();

router.get("/", getProjetsController);
export default router;
