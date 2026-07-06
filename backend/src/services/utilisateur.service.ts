import { Utilisateur } from "../types";
import { getUtilisateursRepository, getUtilisateurIdRepository, postUtilisateurRepository, patchUtilisateurRepository } from "../repositories/utilisateur.repository";

// Logique métier, vérif si adresse email bon format, ou mdp taille suffisante ....

export const getUtilisateursService = async (): Promise<Utilisateur[]> => {
  return await getUtilisateursRepository();
};

export const getUtilisateurIdService = async (id: number): Promise<Utilisateur> => {
  return await getUtilisateurIdRepository(id);
};

export const postUtilisateurService = async (data: Utilisateur): Promise<Utilisateur> => {
  return await postUtilisateurRepository(data);
}

export const patchUtilisateurService = async (id: number, data: Partial<Utilisateur>): Promise<Utilisateur> => {
  return await patchUtilisateurRepository(id, data);
}