import { Utilisateur } from "../types";
import { getUtilisateursRepository, getUtilisateurIdRepository } from "../repositories/utilisateur.repository";

// Logique métier, vérif si adresse email bon format, ou mdp taille suffisante ....

export const getUtilisateursService = async (): Promise<Utilisateur[]> => {
  return await getUtilisateursRepository();
};

export const getUtilisateurIdService = async (id: number): Promise<Utilisateur[]> => {
  return await getUtilisateurIdRepository(id);
};