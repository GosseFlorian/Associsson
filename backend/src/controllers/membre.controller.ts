import { Request, Response } from "express";
import {
  getMembreService,
  getMembreParIdService,
  putMembreService,
  postMembreService,
} from "../services/membre.service";

export async function getMembresController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const membres = await getMembreService();
    res.status(200).json(membres);
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
}

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

export async function putMembreController(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }
  try {
    const data = req.body;
    const membre = await putMembreService(id, data);

    if (!membre) {
      res.status(404).json({ message: "Membre non trouvé" });
      return;
    }

    res.status(200).json(membre);
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération : ", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
}

export async function postMembreController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const data = req.body;
    const nouveauMembre = await postMembreService(data);
    res.status(200).json(nouveauMembre);
    return;
  } catch (error) {
    console.error("Erreur lors de la récupération : ", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
}
