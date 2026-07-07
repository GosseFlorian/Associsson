import { Request, Response } from "express";
import {
  getTachesService,
  
} from "../services/tache.service";

export const getTachesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const taches = await getTachesService();
    res.status(200).json(taches);
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

