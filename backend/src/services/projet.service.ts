import {Projet} from "../types";
import {getProjetsRepository, getProjetByIdRepository, createProjetRepository, updateProjetRepository} from "../repositories/projet.repository"

export const getProjetsService = async (): Promise<Projet[]> => {
    return await getProjetsRepository();
}

export const getProjetByIdService = async (id: number): Promise<Projet | null> => {
  return await getProjetByIdRepository(id);
};

export const createProjetService = async (projet: Omit<Projet, 'id' | 'date_creation'>): Promise<Projet> => {
  return await createProjetRepository(projet);
};

export const updateProjetService = async (id: number, projet: Omit<Projet, 'id' | 'date_creation'>): Promise<Projet | null> => {
  return await updateProjetRepository(id, projet);
};