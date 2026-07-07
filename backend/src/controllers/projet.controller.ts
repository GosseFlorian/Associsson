import { Request, Response } from "express";
import {getProjetsService, getProjetByIdService} from "../services/projet.service";

export const getProjetsController = async (
  req: Request, 
  res: Response,
): Promise<void> => {
    try {
        const projets = await getProjetsService(); 
        res.status(200).json(projets);
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }   
}

export const getProjetByIdController = async (
  req: Request, 
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Identifiant invalide" });
    }

    const projet = await getProjetByIdService(id);
    if (!projet) {
      res.status(404).json({ message: "Projet non trouvé" });
    }

    res.status(200).json(projet);
  } catch (error) {
    console.error("Erreur lors de la récupération du projet :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};