import { Membre } from "../types";
import {
  getMembresRepository,
  getMembreParIdRepository,
  putMembreRepository,
} from "../repositories/membre.repository";

// Logique métier (hors format de URL, verification dans le controller), vérif si adresse email bon format, ou mdp taille suffisante ....

export async function getMembreService(): Promise<Membre[]> {
  return getMembresRepository();
}

export async function getMembreParIdService(
  id: number,
): Promise<Membre | undefined> {
  return getMembreParIdRepository(id);
}

export async function putMembreService(
  id: number,
  data: Partial<Membre>,
): Promise<Membre> {
  return putMembreRepository(id, data);
}
