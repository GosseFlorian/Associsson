import { Router } from "express";
import { getTachesController, getTacheIdController ,postTacheController,putTacheController,} from "../controllers/tache.controller";

const router = Router();

router.get("/", getTachesController);

router.get("/:id", getTacheIdController);
router.post("/", postTacheController);
router.put("/:id", putTacheController);
export default router;
