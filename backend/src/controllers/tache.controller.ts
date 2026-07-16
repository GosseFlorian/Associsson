import { Request, Response } from "express";
import { getTachesService,
   getTacheIdService ,
   postTacheService,
   putTacheService,
   deleteTacheService
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

export const postTacheController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = req.body;
    const nouvelleTache = await postTacheService(data);
    res.status(200).json(nouvelleTache);
    return;
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

export const putTacheController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }

  try {
    const data = req.body;
    const tache = await putTacheService(id, data);

    if (!tache) {
      res.status(404).json({ message: "Tâche non trouvée" });
      return;
    }

    res.status(200).json(tache);
    return;
  } catch (error) {
    console.error("Erreur lors de la modification :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

export const deleteTacheController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }

  try {
    const tache = await deleteTacheService(id);

    if (!tache) {
      res.status(404).json({ message: "Tâche non trouvée" });
      return;
    }

    res.status(200).json(tache);
    return;
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};



