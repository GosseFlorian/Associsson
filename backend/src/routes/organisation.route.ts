import { Router } from "express";
import {
  getOrganisationIdController,
  getOrganisationController,
  postOrganisationController,
  putOrganisationController,
  deleteOrganisationController,
} from "../controllers/organisation.controller";

const router = Router();

router.get("/", getOrganisationController);
router.get("/:id", getOrganisationIdController);
router.post("/", postOrganisationController);
router.put("/:id", putOrganisationController);
router.delete("/:id", deleteOrganisationController);

export default router;
