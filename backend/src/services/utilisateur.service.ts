import { Utilisateur } from "../types";
import {
  getUtilisateursRepository,
  getUtilisateurIdRepository,
  postUtilisateurRepository,
  putUtilisateurRepository,
} from "../repositories/utilisateur.repository";

// Logique métier, vérif si adresse email bon format, ou mdp taille suffisante ....

export const getUtilisateursService = async (): Promise<Utilisateur[]> => {
  return await getUtilisateursRepository();
};

export const getUtilisateurIdService = async (
  id: number,
): Promise<Utilisateur | undefined> => {
  return await getUtilisateurIdRepository(id);
};

export const postUtilisateurService = async (
  data: Utilisateur,
): Promise<Utilisateur> => {
  return await postUtilisateurRepository(data);
};

export const putUtilisateurService = async (
  id: number,
  data: Partial<Utilisateur>,
): Promise<Utilisateur> => {
  return await putUtilisateurRepository(id, data);
};
