import {Projet} from "../types";
import {getProjetsRepository, getProjetByIdRepository, postProjetRepository} from "../repositories/projet.repository"

export const getProjetsService = async (): Promise<Projet[]> => {
    return await getProjetsRepository();
}

export const getProjetByIdService = async (
  id: number,
): Promise<Projet | undefined> => {
  return await getProjetByIdRepository(id);
};

export const postProjetService= async (
  data: Projet,
):Promise<Projet> => {
return await postProjetRepository(data);
};