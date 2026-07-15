import { Router } from "express";
import { getTachesController, getTacheIdController ,postTacheController,} from "../controllers/tache.controller";

const router = Router();

router.get("/", getTachesController);

router.get("/:id", getTacheIdController);
router.post("/", postTacheController);

export default router;
