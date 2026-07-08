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
        console.error("Erreur lors de la récupération :", error);
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

export const postProjetController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = req.body;    
    const nouveauProjet = await postProjetService(data)
    res.status(200).json(nouveauProjet);
    return; 
  } catch (error) {
    console.error("Erreur lors de la création du projet :", error);
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
        const data = req.body;
        const projetModifie = await putProjetService(id, data);
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
        res.status(200).json(projetSupprime);
        return;
    } catch (error) {
        console.error("Erreur lors de la suppression du projet :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
        return;
    }
};
