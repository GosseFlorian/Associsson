import { Router } from "express";
import { getTachesController } from "../controllers/tache.controller";

const router = Router();

router.get("/", getTachesController);

export default router;
