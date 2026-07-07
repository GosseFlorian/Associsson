import { Request, Response } from "express";
import { getOrganisationIdService } from "../services/organisation.service";

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
