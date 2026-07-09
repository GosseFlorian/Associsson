import { Router } from "express";
import { getTachesController,
     getTacheIdController } from "../controllers/tache.controller";

const router = Router();

router.get("/tache", getTachesController);
router.get("/tache/:id", getTacheIdController);

export default router;
