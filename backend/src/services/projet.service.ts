import {Projet} from "../types";
import {
  getProjetsRepository,
  getProjetByIdRepository,
  postProjetRepository,
  putProjetRepository,
} from "../repositories/projet.repository";

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

export const putProjetService = async (
  id: number, 
  data: Projet,
): Promise<Projet> => {
    return await putProjetRepository(id, data);
};