import {Projet} from "../types";
import {
  getProjetsRepository,
  getProjetByIdRepository,
  postProjetRepository,
  putProjetRepository,
  patchProjetRepository
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

export const patchProjetService = async (
    id: number,
    data: Partial<Projet>,
): Promise<Projet> => {
    return await patchProjetRepository(id, data);
};