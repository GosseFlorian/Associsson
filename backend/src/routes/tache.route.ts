import { Router } from "express";
import { getTachesController, getTacheIdController ,postTacheController} from "../controllers/tache.controller";

const router = Router();

router.get("/tache", getTachesController);
router.get("/tache/:id", getTacheIdController);
router.post("/tache", postTacheController);

export default router;
