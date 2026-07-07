import { Request, Response } from "express";
import {
  getProjetsService
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
}
