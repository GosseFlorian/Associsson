import { Projet, ProjetDetails } from "../types";
import {
  getProjetsRepository,
  getProjetByIdRepository,
  postProjetRepository,
  putProjetRepository,
  deleteProjetRepository,
} from "../repositories/projet.repository";

export const getProjetsService = async (): Promise<ProjetDetails[]> => {
  return await getProjetsRepository();
};

export const getProjetByIdService = async (
  id: number,
): Promise<ProjetDetails | null> => {
  return await getProjetByIdRepository(id);
};

export const postProjetService = async (data: Projet): Promise<Projet> => {
  // Validation du titre
  if (!data.titre || data.titre.trim() === "") {
    throw new Error("Le titre du projet est obligatoire");
  }
  return await postProjetRepository(data);
};

export const putProjetService = async (
  id: number,
  data: Projet,
): Promise<Projet | null> => {
  return await putProjetRepository(id, data);
};

export const deleteProjetService = async (
  id: number,
): Promise<Projet | null> => {
  return await deleteProjetRepository(id);
};
