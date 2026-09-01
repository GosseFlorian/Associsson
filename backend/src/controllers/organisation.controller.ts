import { Request, Response } from 'express';
import { logError } from '../lib/logError';
import { envoyerSiAccesRefuse } from '../lib/errors';
import {
  getOrganisationIdService,
  getOrganisationsService,
  postOrganisationService,
  putOrganisationService,
  deleteOrganisationService,
} from '../services/organisation.service';

export const getOrganisationsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organisations = await getOrganisationsService(
      req.utilisateur!.utilisateurId
    );
    res.status(200).json(organisations);
    return;
  } catch (error) {
    logError(req, error, 'Erreur lors de la récuperation des organisations');
    if (envoyerSiAccesRefuse(req, res, error)) {
      return;
    }
    res.status(500).json({ message: 'Erreur interne du serveur' });
    return;
  }
};

export const getOrganisationIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: 'ID invalide' });
    return;
  }
  try {
    const organisation = await getOrganisationIdService(
      id,
      req.utilisateur!.utilisateurId
    );

    if (!organisation) {
      res.status(404).json({ message: 'Organisation non trouvé' });
      return;
    }
    res.status(200).json(organisation);
  } catch (error) {
    logError(req, error, 'Erreur lors de la récuperation de organisation');
    if (envoyerSiAccesRefuse(req, res, error)) {
      return;
    }
    res.status(500).json({ message: 'Erreur interne du serveur' });
    return;
  }
};

export const postOrganisationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;
    if (!data || !data.nom) {
      res
        .status(400)
        .json({ message: "Le nom de l'organisation est obligatoire" });
      return;
    }
    const nouvelleOrganisation = await postOrganisationService(
      data,
      req.utilisateur!.utilisateurId
    );
    res.status(201).json(nouvelleOrganisation);
    return;
  } catch (error: any) {
    logError(req, error, "Erreur lors de la création de l'organisation");
    if (envoyerSiAccesRefuse(req, res, error)) {
      return;
    }
    // On gère les erreurs de validation métier renvoyées par le service
    if (error.message && error.message.includes('obligatoire')) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Erreur interne du serveur' });
    return;
  }
};

export const putOrganisationController = async (
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
    const organisation = await putOrganisationService(
      id,
      data,
      req.utilisateur!.utilisateurId
    );

    if (!organisation) {
      res.status(404).json({ message: 'Organisation non trouvé' });
      return;
    }

    res.status(200).json(organisation);
    return;
  } catch (error) {
    logError(req, error, "Erreur lors de la modification de l'organisation");
    if (envoyerSiAccesRefuse(req, res, error)) {
      return;
    }
    res.status(500).json({ message: 'Erreur interne du serveur' });
    return;
  }
};

export const deleteOrganisationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: 'ID invalide' });
    return;
  }
  try {
    const organisation = await deleteOrganisationService(
      id,
      req.utilisateur!.utilisateurId
    );

    if (!organisation) {
      res.status(404).json({ message: 'Organisation non trouvé' });
      return;
    }
    res.status(200).json(organisation);
  } catch (error) {
    logError(req, error, "Erreur lors de la suppression de l'organisation");
    if (envoyerSiAccesRefuse(req, res, error)) {
      return;
    }
    res.status(500).json({ message: 'Erreur interne du serveur' });
    return;
  }
};
