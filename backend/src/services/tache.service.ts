import { 
  getTacheRepository,
  getTacheByIdRepository
} from "../repositories/tache.repository";
import { Tache } from "../types";

export const getTacheService = async (): Promise<Tache[]> => {
  return await getTacheRepository();
};

export const getTacheIdService = async (
  id: number,
): Promise<Tache | undefined> => {
  return await getTacheByIdRepository(id);
};
