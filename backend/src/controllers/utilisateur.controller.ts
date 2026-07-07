import { Request, Response } from "express";
import {
  getUtilisateursService,
  getUtilisateurIdService,
  postUtilisateurService,
  putUtilisateurService,
} from "../services/utilisateur.service";

export const getUtilisateursController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const utilisateurs = await getUtilisateursService();
    res.status(200).json(utilisateurs);
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

export const getUtilisateurIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }
  try {
    const utilisateur = await getUtilisateurIdService(id);

    if (!utilisateur) {
      res.status(404).json({ message: "Membre non trouvé" });
      return;
    }
    res.status(200).json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

export const postUtilisateurController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = req.body;
    const nouvelleUtilisateur = await postUtilisateurService(data);
    res.status(200).json(nouvelleUtilisateur);
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération : ", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

export const putUtilisateurController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const utilisateur = await putUtilisateurService(id, data);
    res.status(200).json(utilisateur);
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération : ", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};
