import { Router } from "express";
import { getOrganisationIdController } from "../controllers/organisation.controller";

const router = Router();

router.get("/", getOrganisationController);
router.get("/:id", getOrganisationIdController);

export default router;
