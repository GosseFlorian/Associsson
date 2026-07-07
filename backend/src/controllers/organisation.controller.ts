import { Request, Response } from "express";
import { getOrganisationService } from "../services/organisation.service";

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
