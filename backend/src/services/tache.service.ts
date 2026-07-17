import {
  getTachesRepository,
  getTacheByIdRepository,
  postTacheRepository,
  putTacheRepository,
  deleteTacheRepository,
} from "../repositories/tache.repository";
import { Tache, TacheDetails } from "../types";

export const getTachesService = async (): Promise<TacheDetails[]> => {
  return await getTachesRepository();
};

export const getTacheIdService = async (
  id: number,
): Promise<TacheDetails | null> => {
  return await getTacheByIdRepository(id);
};

export const postTacheService = async (data: Tache): Promise<Tache> => {
  // Validation du titre
  if (!data.titre || data.titre.trim() === "") {
    throw new Error("Le titre de la tâche est obligatoire");
  }
  return await postTacheRepository(data);
};

export const putTacheService = async (
  id: number,
  data: Partial<Tache>,
): Promise<Tache | null> => {
  return await putTacheRepository(id, data);
};

export const deleteTacheService = async (id: number): Promise<Tache | null> => {
  return await deleteTacheRepository(id);
};
