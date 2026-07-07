import { Membre } from "../types";
import {
  getMembresRepository,
  getMembreParIdRepository,
} from "../repositories/membre.repository";

// Logique métier, vérif si adresse email bon format, ou mdp taille suffisante ....

export const getMembreService = async (): Promise<Membre[]> => {
  return await getMembresRepository();
};

export async function getMembreParIdService(
  id: number,
): Promise<Membre | undefined> {
  return getMembreParIdRepository(id);
}
