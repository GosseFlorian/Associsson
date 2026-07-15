import { 
  getTachesRepository,
  getTacheByIdRepository
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
