import { 
  getTachesRepository,
  getTacheByIdRepository,
  postTacheRepository,
  putTacheRepository,
  deleteTacheRepository
} from "../repositories/tache.repository";
import { Tache } from "../types";

export const getTachesService = async (): Promise<Tache[]> => {
  return await getTachesRepository();
};

export const getTacheIdService = async (
  id: number,
): Promise<Tache | undefined> => {
  return await getTacheByIdRepository(id);
};

export const postTacheService = async (data: Tache): Promise<Tache> => {
  return await postTacheRepository(data);
};

export const putTacheService = async (
  id: number,
  data: Partial<Tache>,
): Promise<Tache> => {
  return await putTacheRepository(id, data);
};


export const deleteTacheService = async (id: number): Promise<Tache> => {
  return await deleteTacheRepository(id);
};
