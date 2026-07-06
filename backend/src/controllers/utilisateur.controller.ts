import { Request, Response } from "express";
import { getUtilisateursService, getUtilisateurIdService, postUtilisateurService, patchUtilisateurService } from "../services/utilisateur.service";

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
    const err = error as Error;

    if (err.message === "INVALID_ID") {
      return res.status(400).json({ message: "L'id doit être un nombre" });
    }
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const postUtilisateurController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try{
    const data = req.body;
    const nouvelleUtilisateur = await postUtilisateurService(data);
    return res.status(200).json(nouvelleUtilisateur);
  } catch (error){
    console.error("Erreur lors de la récupération : ", error);
    return res.status(500).json({ message: "Erreur interne du serveur"});
  }
};

export const patchUtilisateurController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try{
    const id = Number(req.params.id);
    const data = req.body;
    const utilisateur = await patchUtilisateurService(id, data);
    return res.status(200).json(utilisateur);
  } catch (error){
    console.error("Erreur lors de la récupération : ", error);
    return res.status(500).json({ message: "Erreur interne du serveur"});
  }
};