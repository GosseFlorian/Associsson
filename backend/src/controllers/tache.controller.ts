import { Request, Response } from "express";
import {
  getTachesService,
  getTacheIdService,
  postTacheService,
  putTacheService,
  deleteTacheService,
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
    console.error("Erreur lors de la récupération des tâches :", error);
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
    console.error("Erreur lors de la récupération de la tâche :", error);
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
    if (!data || !data.titre || !data.projet_id) {
      res
        .status(400)
        .json({ message: "Données de la tâche invalides ou manquantes" });
      return;
    }
    const nouvelleTache = await postTacheService(data);
    res.status(201).json(nouvelleTache);
    return;
  } catch (error: any) {
    console.error("Erreur lors de la création de la tâche :", error);
    // On gère les erreurs de validation métier renvoyées par le service
    if (error.message && error.message.includes("obligatoire")) {
      res.status(400).json({ message: error.message });
      return;
    }
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
    // Validation qu'au moins un champ est fourni pour la mise à jour
    if (!data || Object.keys(data).length === 0) {
      res
        .status(400)
        .json({ message: "Aucune donnée fournie pour la modification" });
      return;
    }
    const tache = await putTacheService(id, data);
    if (!tache) {
      res.status(404).json({ message: "Tâche non trouvée" });
      return;
    }
    res.status(200).json(tache);
    return;
  } catch (error) {
    console.error("Erreur lors de la modification de la tâche :", error);
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
    console.error("Erreur lors de la suppression de la tâche :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};
