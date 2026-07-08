import { Request, Response } from "express";
import { getTacheService } from "../services/tache.service";

export const getTacheController = async (req: Request, res: Response) => {
  try {
    const taches = await getTacheService();
    res.json(taches);
  } catch (error) {
    console.error("Erreur GET /tache :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
