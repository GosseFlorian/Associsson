import { Request, Response } from "express";
import {
  getProjetsService,
  getProjetByIdService,
  postProjetService,
  putProjetService,
  deleteProjetService,
} from "../services/projet.service";

export const getProjetsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projets = await getProjetsService();
    res.status(200).json(projets);
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const getProjetByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }
    const projet = await getProjetByIdService(id);
    if (!projet) {
      res.status(404).json({ message: "Projet non trouvé" });
      return;
    }
    res.status(200).json(projet);
  } catch (error) {
    console.error("Erreur lors de la récupération du projet :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const postProjetController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = req.body;
    if (!data || !data.titre || !data.organisation_id) {
      res.status(400).json({ message: "Données du projet incomplètes" });
      return;
    }
    const nouveauProjet = await postProjetService(data);
    res.status(201).json(nouveauProjet);
    return;
  } catch (error: any) {
    console.error("Erreur lors de la création du projet :", error);
    // On gère les erreurs de validation métier renvoyées par le service
    if (error.message && error.message.includes("obligatoire")) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

export const putProjetController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ message: "ID invalide" });
      return;
    }
    const data = req.body;
    // Validation qu'au moins un champ est fourni pour la mise à jour
    if (!data || Object.keys(data).length === 0) {
      res.status(400).json({ message: "Aucune donnée à modifier fournie" });
      return;
    }
    const projetModifie = await putProjetService(id, data);
    if (!projetModifie) {
      res.status(404).json({ message: "Projet non trouvé" });
      return;
    }
    res.status(200).json(projetModifie);
    return;
  } catch (error) {
    console.error("Erreur lors de la modification du projet :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

export const deleteProjetController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }
  try {
    const projetSupprime = await deleteProjetService(id);
    if (!projetSupprime) {
      res.status(404).json({ message: "Projet non trouvé" });
      return;
    }
    res.status(200).json(projetSupprime);
    return;
  } catch (error) {
    console.error("Erreur lors de la suppression du projet :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};
