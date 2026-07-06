import { Router } from "express";
import { getMembresController } from "../controllers/membre.controller";

const router = Router();

router.get("/", getMembresController);

export default router;
