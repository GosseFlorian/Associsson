import { Request, Response } from "express";
import {postProjetService} from "../services/projet.service";

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