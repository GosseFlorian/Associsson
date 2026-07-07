import { Tache } from "../types";
import {
  getTachesRepository,
  getTacheIdRepository,
  postTacheRepository,
  putTacheRepository,
  deleteTacheRepository,
} from "../repositories/tache.repository";

// GET toutes les tâches
export const getTachesService = async (): Promise<Tache[]> => {
  return await getTachesRepository();
};

// GET une tâche par ID
export const getTacheIdService = async (
  id: number,
): Promise<Tache | undefined> => {
  return await getTacheIdRepository(id);
};

// POST une tâche
export const postTacheService = async (data: Tache): Promise<Tache> => {
  return await postTacheRepository(data);
};

// PUT une tâche
export const putTacheService = async (
  id: number,
  data: Partial<Tache>,
): Promise<Tache> => {
  return await putTacheRepository(id, data);
};

// DELETE une tâche
export const deleteTacheService = async (id: number): Promise<Tache> => {
  return await deleteTacheRepository(id);
};
