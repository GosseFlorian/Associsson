import {request, response} from "express";
import {getProjetsService} from "../services/projet.service";

export const getProjetsController = async (req: typeof request, res: typeof response) => {
    try {
        const projets = await getProjetsService(); 
        return res.status(200).json(projets);
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }   
}