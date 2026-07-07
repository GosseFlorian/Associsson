import { Request, Response } from "express";
import { getTachesService } from "../services/tache.service";

export const gettacheController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const tache = await getTachesService();
    return res.status(200).json(tache);
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
