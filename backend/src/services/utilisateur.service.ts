import bcrypt from "bcryptjs";
import { creerToken } from "../lib/jwt";
import { Utilisateur } from "../types/types";
import {
  getUtilisateurByEmailRepository,
  getUtilisateursRepository,
  getUtilisateurIdRepository,
  postUtilisateurRepository,
  putUtilisateurRepository,
  deleteUtilisateurRepository,
} from "../repositories/utilisateur.repository";

// Fonction utilitaire de validation de l'adresse email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const postConnexionService = async (
  email: string,
  motDePasse: string,
): Promise<{
  token: string;
  utilisateur: Omit<Utilisateur, "mot_de_passe">;
}> => {
  const utilisateur = await getUtilisateurByEmailRepository(email);

  if (
    !utilisateur ||
    !(await bcrypt.compare(motDePasse, utilisateur.mot_de_passe))
  ) {
    throw new Error("Identifiants invalides");
  }

  const token = creerToken({ utilisateurId: utilisateur.id });
  const { mot_de_passe, ...utilisateurPublic } = utilisateur;

  return { token, utilisateur: utilisateurPublic };
};

export const getUtilisateursService = async (): Promise<Utilisateur[]> => {
  return await getUtilisateursRepository();
};

export const getUtilisateurIdService = async (
  id: number,
): Promise<Utilisateur | null> => {
  return await getUtilisateurIdRepository(id);
};

export const postUtilisateurService = async (
  data: Utilisateur,
): Promise<Utilisateur> => {
  // Validation de l'adresse mail
  if (!isValidEmail(data.email)) {
    throw new Error("Format de l'adresse email invalide.");
  }
  // Validation de la complexité minimale du mot de passe
  if (!data.mot_de_passe || data.mot_de_passe.length < 6) {
    throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
  }

  const motDePasseHache = await bcrypt.hash(data.mot_de_passe, 10);
  return await postUtilisateurRepository({
    ...data,
    mot_de_passe: motDePasseHache,
  });
};

export const putUtilisateurService = async (
  id: number,
  data: Partial<Utilisateur>,
): Promise<Utilisateur | null> => {
  // Si l'email est modifié, on le valide
  if (data.email !== undefined && !isValidEmail(data.email)) {
    throw new Error("Format de l'adresse email invalide.");
  }
  // Si le mot de passe est modifié, on le valide
  if (data.mot_de_passe !== undefined && data.mot_de_passe.length < 6) {
    throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
  }
  return await putUtilisateurRepository(id, data);
};

export const deleteUtilisateurService = async (
  id: number,
): Promise<Utilisateur | null> => {
  return await deleteUtilisateurRepository(id);
};
