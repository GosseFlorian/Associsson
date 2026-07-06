import { Membre } from "../types";
import { getMembresRepository } from "../repositories/membre.repository";

// Logique métier, vérif si adresse email bon format, ou mdp taille suffisante ....

export const getMembreService = async (): Promise<Membre[]> => {
  return await getMembresRepository();
};
