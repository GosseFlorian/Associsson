import { Router } from "express";
import {
  getMembresController,
  getMembresParIdController,
  putMembreController,
  postMembreController,
} from "../controllers/membre.controller";

const router = Router();

router.get("/", getMembresController);
router.get("/:id", getMembresParIdController);
router.put("/:id", putMembreController);
router.post("/", postMembreController);

export default router;
