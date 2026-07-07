import { Router } from "express";
import { getOrganisationController } from "../controllers/organisation.controller";

const router = Router();

router.get("/", getOrganisationController);

export default router;
