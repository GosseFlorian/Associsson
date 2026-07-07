import { Router } from "express";
import {
  getMembresController,
  getMembresParIdController,
  postMembreController,
} from "../controllers/membre.controller";

const router = Router();

router.get("/", getMembresController);
router.get("/:id", getMembresParIdController);
router.post("/", postMembreController);

export default router;
