import { Router } from "express";
import {
  getMembresController,
  getMembresParIdController,
} from "../controllers/membre.controller";

const router = Router();

router.get("/", getMembresController);
router.get("/:id", getMembresParIdController);

export default router;
