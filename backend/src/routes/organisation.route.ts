import { Router } from "express";
import {
  getOrganisationIdController,
  getOrganisationsController,
  postOrganisationController,
  putOrganisationController,
  deleteOrganisationController,
} from "../controllers/organisation.controller";

const router = Router();

router.get("/", getOrganisationsController);
router.get("/:id", getOrganisationIdController);
router.post("/", postOrganisationController);
router.put("/:id", putOrganisationController);
router.delete("/:id", deleteOrganisationController);

export default router;
