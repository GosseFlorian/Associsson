import { Router } from "express";
import {
  getMembresController,
  getMembresParIdController,
  postMembreController,
  deleteMembreController,
} from "../controllers/membre.controller";

const router = Router();

router.get("/", getMembresController);
router.get("/:id", getMembresParIdController);
router.post("/", postMembreController);
router.delete("/:id", deleteMembreController);

export default router;
