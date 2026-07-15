import { Router } from "express";
import { getTachesController, getTacheIdController } from "../controllers/tache.controller";

const router = Router();

router.get("/", getTachesController);

router.get("/:id", getTacheIdController);

export default router;
