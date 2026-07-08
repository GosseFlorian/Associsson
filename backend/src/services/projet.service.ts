import {Projet} from "../types";
import {getProjetsRepository, getProjetByIdRepository, postProjetRepository} from "../repositories/projet.repository"

export const getProjetsService = async (): Promise<Projet[]> => {
    return await getProjetsRepository();
}

export const getProjetByIdService = async (
  id: number,
): Promise<Projet | undefined> => {
  return await getProjetByIdRepository(id);
<<<<<<< HEAD
};

export const postProjetService= async (
  data: Projet,
):Promise<Projet> => {
return await postProjetRepository(data);
=======
>>>>>>> e7d09146ba55132efcdbb61b34ae53a9b46ccbb4
};