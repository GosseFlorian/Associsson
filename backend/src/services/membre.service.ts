import { Membre, MembreDetails } from "../types";
import {
  getMembresRepository,
  getMembreParIdRepository,
  putMembreRepository,
  postMembreRepository,
  deleteMembreRepository,
} from "../repositories/membre.repository";

export async function getMembreService(): Promise<MembreDetails[]> {
  return getMembresRepository();
}

export async function getMembreParIdService(
  id: number,
): Promise<MembreDetails | null> {
  return getMembreParIdRepository(id);
}

export async function postMembreService(data: Membre): Promise<Membre> {
  // Validation du role
  if (!data.role || data.role.trim() === "") {
    throw new Error("Le role du membre est obligatoire");
  }
  return postMembreRepository(data);
}

export async function putMembreService(
  id: number,
  data: Partial<Membre>,
): Promise<Membre | null> {
  return putMembreRepository(id, data);
}

export async function deleteMembreService(id: number): Promise<Membre | null> {
  return deleteMembreRepository(id);
}
