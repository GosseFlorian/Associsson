import { Request, Response } from "express";
import { getUtilisateursService, getUtilisateurIdService } from "../services/utilisateur.service";

export const getUtilisateursController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const utilisateurs = await getUtilisateursService();
    return res.status(200).json(utilisateurs);
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const getUtilisateurIdController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try{
    const id = Number(req.params.id);
    const utilisateur = await getUtilisateurIdService(id);
    return res.status(200).json(utilisateur);
  } catch (error) {
    console.error("Errur lors de la récupération : ", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};