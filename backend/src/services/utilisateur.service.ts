import { Utilisateur } from "../types";
import { getUtilisateursRepository } from "../repositories/utilisateur.repository";

// Logique métier, vérif si adresse email bon format, ou mdp taille suffisante ....

export const getUtilisateursService = async (): Promise<Utilisateur[]> => {
  return await getUtilisateursRepository();
};
