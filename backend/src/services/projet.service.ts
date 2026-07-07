import {Projet} from "../types";
import {getProjetByIdRepository} from "../repositories/projet.repository"

export const getProjetByIdService = async (
  id: number,
): Promise<Projet | undefined> => {
  return await getProjetByIdRepository(id);
};