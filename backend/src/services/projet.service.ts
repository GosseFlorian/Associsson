import {Projet} from "../types";
import {getProjetsRepository, getProjetByIdRepository} from "../repositories/projet.repository"

export const getProjetsService = async (): Promise<Projet[]> => {
    return await getProjetsRepository();
}

export const getProjetByIdService = async (id: number): Promise<Projet | null> => {
  return await getProjetByIdRepository(id);
};
