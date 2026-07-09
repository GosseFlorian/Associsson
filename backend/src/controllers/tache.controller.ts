import { Request, Response } from "express";
import { getTacheService, 
  getTacheIdService } from "../services/tache.service";

export const getTachesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const taches = await getTacheService();
    res.status(200).json(taches);
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

export const getTacheIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }

  try {
    const tache = await getTacheIdService(id);

    if (!tache) {
      res.status(404).json({ message: "Tâche non trouvée" });
      return;
    }

    res.status(200).json(tache);
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};
