import { Request, Response } from "express";
import {getProjetsService, getProjetByIdService, createProjetService} from "../services/projet.service";

export const getProjetsController = async (req: Request, res: Response) => {
    try {
        const projets = await getProjetsService(); 
        return res.status(200).json(projets);
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }   
}

export const getProjetByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Identifiant invalide" });
    }

    const projet = await getProjetByIdService(id);
    if (!projet) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    return res.status(200).json(projet);
  } catch (error) {
    console.error("Erreur lors de la récupération du projet :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const createProjetController = async (req: Request, res: Response) => {
  try {
    const { organisation_id, createur_id, titre, description, date_debut, date_fin, adresse, est_termine } = req.body;
    
    if (!organisation_id || !createur_id || !titre) {
      return res.status(400).json({ message: "Les champs organisation_id, createur_id et titre sont requis" });
    }

    const nouveauProjet = await createProjetService({
      organisation_id,
      createur_id,
      titre,
      description,
      date_debut,
      date_fin,
      adresse,
      est_termine
    });

    return res.status(201).json(nouveauProjet);
  } catch (error) {
    console.error("Erreur lors de la création du projet :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
