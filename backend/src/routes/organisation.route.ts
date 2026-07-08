import { Router } from "express";
import {
  getOrganisationIdController,
  getOrganisationController,
} from "../controllers/organisation.controller";

const router = Router();

router.get("/", getOrganisationController);
router.get("/:id", getOrganisationIdController);

export default router;
