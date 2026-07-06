import { Request, Response } from "express";
import { getMembreService } from "../services/membre.service";

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
