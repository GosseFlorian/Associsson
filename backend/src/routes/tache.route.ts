import { Router } from "express";
import { getTacheController } from "../controllers/tache.controller";

const router = Router();

router.get("/", getTacheController);

export default router;
