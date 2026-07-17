import { Request, Response } from "express";
import {
  getOrganisationIdService,
  getOrganisationService,
  postOrganisationService,
  putOrganisationService,
  deleteOrganisationService,
} from "../services/organisation.service";

export const getOrganisationIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }
  try {
    const organisation = await getOrganisationIdService(id);

    if (!organisation) {
      res.status(404).json({ message: "Organisation non trouvé" });
      return;
    }
    res.status(200).json(organisation);
  } catch (error) {
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

export const getOrganisationController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const organisation = await getOrganisationService();
    res.status(200).json(organisation);
    return;
  } catch (error) {
    console.error("Erreur lors de la récuperation : ", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

export const postOrganisationController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = req.body;
    const nouvelleOrganisation = await postOrganisationService(data);
    res.status(200).json(nouvelleOrganisation);
    return;
  } catch (error) {
    console.error("Erreur lors de la récuperation :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

export const putOrganisationController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }
  try {
    const data = req.body;
    const organisation = await putOrganisationService(id, data);

    if (!organisation) {
      res.status(404).json({ message: "Organisation non trouvé" });
      return;
    }

    res.status(200).json(organisation);
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération : ", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};

export const deleteOrganisationController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }
  try {
    const organisation = await deleteOrganisationService(id);

    if (!organisation) {
      res.status(404).json({ message: "Organisation non trouvé" });
      return;
    }
    res.status(200).json(organisation);
  } catch (error) {
    console.error("Erreur lors de la récupération : ", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
};
