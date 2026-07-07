import { Request, Response } from "express";
import {
  getMembreService,
  getMembreParIdService,
} from "../services/membre.service";

export const getMembresController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const membres = await getMembreService();
    return res.status(200).json(membres);
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export async function getMembresParIdController(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }
  try {
    const membre = await getMembreParIdService(id);
    if (!membre) {
      res.status(404).json({ message: "Membre non trouvé" });
      return;
    }
    res.status(200).json(membre);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
}
