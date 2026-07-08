import {Projet} from "../types";
import {postProjetRepository} from "../repositories/projet.repository"

export const postProjetService= async (
  data: Projet,
):Promise<Projet> => {
return await postProjetRepository(data);
};