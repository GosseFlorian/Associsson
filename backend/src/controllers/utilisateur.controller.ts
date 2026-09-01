import { Request, Response } from 'express';
import { logError } from '../lib/logError';
import { envoyerSiAccesRefuse } from '../lib/errors';
import {
  postConnexionService,
  getUtilisateursService,
  getUtilisateurIdService,
  postUtilisateurService,
  putUtilisateurService,
  deleteUtilisateurService,
} from '../services/utilisateur.service';

export const postConnexionController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      res.status(400).json({ message: 'Identifiants manquants' });
      return;
    }

    const resultat = await postConnexionService(email, mot_de_passe);
    res.status(200).json(resultat);
    return;
  } catch (error: any) {
    logError(req, error, 'Erreur lors de la connexion');
    if (error.message === 'Identifiants invalides') {
      res.status(401).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

export const getUtilisateursController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const utilisateurs = await getUtilisateursService();
    res.status(200).json(utilisateurs);
    return;
  } catch (error) {
    logError(req, error, 'Erreur lors de la récupération des utilisateurs');
    res.status(500).json({ message: 'Erreur interne du serveur' });
    return;
  }
};

export const getUtilisateurIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: 'ID invalide' });
    return;
  }
  try {
    const utilisateur = await getUtilisateurIdService(
      id,
      req.utilisateur!.utilisateurId
    );
    if (!utilisateur) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }
    res.status(200).json(utilisateur);
  } catch (error) {
    logError(req, error, "Erreur lors de la récupération de l'utilisateur");
    if (envoyerSiAccesRefuse(req, res, error)) {
      return;
    }
    res.status(500).json({ message: 'Erreur interne du serveur' });
    return;
  }
};

export const postUtilisateurController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;
    if (!data || !data.nom || !data.email || !data.mot_de_passe) {
      res.status(400).json({ message: "Données d'inscription incomplètes" });
      return;
    }
    const nouvelleUtilisateur = await postUtilisateurService(data);
    res.status(201).json(nouvelleUtilisateur);
    return;
  } catch (error: any) {
    logError(req, error, "Erreur lors de la création de l'utilisateur");
    // On gère les erreurs de validation métier renvoyées par le service
    if (
      error.message &&
      (error.message.includes('Format') ||
        error.message.includes('mot de passe'))
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Erreur interne du serveur' });
    return;
  }
};

export const putUtilisateurController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: 'ID invalide' });
    return;
  }
  try {
    const data = req.body;
    // Validation qu'au moins un champ est fourni pour la mise à jour
    if (!data || Object.keys(data).length === 0) {
      res.status(400).json({ message: 'Aucune donnée à modifier fournie' });
      return;
    }
    const utilisateur = await putUtilisateurService(
      id,
      data,
      req.utilisateur!.utilisateurId
    );
    if (!utilisateur) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }
    res.status(200).json(utilisateur);
    return;
  } catch (error: any) {
    logError(req, error, "Erreur lors de la modification de l'utilisateur");
    if (envoyerSiAccesRefuse(req, res, error)) {
      return;
    }
    // On gère les erreurs de validation métier renvoyées par le service
    if (
      error.message &&
      (error.message.includes('Format') ||
        error.message.includes('mot de passe'))
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Erreur interne du serveur' });
    return;
  }
};

export const deleteUtilisateurController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: 'ID invalide' });
    return;
  }
  try {
    const utilisateur = await deleteUtilisateurService(
      id,
      req.utilisateur!.utilisateurId
    );
    if (!utilisateur) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }
    res.status(200).json(utilisateur);
  } catch (error) {
    logError(req, error, "Erreur lors de la suppression de l'utilisateur");
    if (envoyerSiAccesRefuse(req, res, error)) {
      return;
    }
    res.status(500).json({ message: 'Erreur interne du serveur' });
    return;
  }
};
