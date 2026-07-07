import { Router } from "express";
import {
  getMembresController,
  getMembresParIdController,
  putMembreController,
} from "../controllers/membre.controller";

const router = Router();

router.get("/", getMembresController);
router.get("/:id", getMembresParIdController);
router.put("/:id", putMembreController);

export default router;
