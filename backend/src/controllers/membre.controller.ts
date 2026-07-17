import { Request, Response } from "express";
import {
  getMembreService,
  getMembreParIdService,
  putMembreService,
  postMembreService,
  deleteMembreService,
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
    console.error("Erreur lors de la récupération des membres :", error);
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
    console.error("Erreur lors de la récupération du membre:", error);
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
    // Validation qu'au moins un champ est fourni pour la mise à jour
    if (!data || Object.keys(data).length === 0) {
      res.status(400).json({ message: "Aucune donnée à modifier fournie" });
      return;
    }
    const membre = await putMembreService(id, data);

    if (!membre) {
      res.status(404).json({ message: "Membre non trouvé" });
      return;
    }

    res.status(200).json(membre);
    return;
  } catch (error) {
    console.error("Erreur lors de la modification du membre : ", error);
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
    if (!data || !data.utilisateur_id || !data.organisation_id) {
      res.status(400).json({ message: "Données du membre incomplètes" });
      return;
    }
    const nouveauMembre = await postMembreService(data);
    res.status(201).json(nouveauMembre);
    return;
  } catch (error: any) {
    console.error("Erreur lors de la création du membre : ", error);
    // On gère les erreurs de validation métier renvoyées par le service
    if (error.message && error.message.includes("obligatoire")) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
}

export async function deleteMembreController(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "ID invalide" });
    return;
  }
  try {
    const membre = await deleteMembreService(id);
    if (!membre) {
      res.status(404).json({ message: "Membre non trouvé" });
      return;
    }
    res.status(200).json(membre);
  } catch (error) {
    console.error("Erreur lors de la récupération : ", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
    return;
  }
}
