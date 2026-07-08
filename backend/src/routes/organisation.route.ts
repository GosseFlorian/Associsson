import { Router } from "express";
import {
  getOrganisationIdController,
  getOrganisationController,
  postOrganisationController,
} from "../controllers/organisation.controller";

const router = Router();

router.get("/", getOrganisationController);
router.get("/:id", getOrganisationIdController);
router.post("/", postOrganisationController);

export default router;
