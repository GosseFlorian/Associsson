import { Router } from "express";
import {getTachesRepository } from "../repositories/tache.repository";

const router = Router();

router.get("/", getTachesRepository);

export default router;
