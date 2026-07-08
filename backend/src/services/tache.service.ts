import { getTacheRepository } from "../repositories/tache.repository";
import { Tache } from "../types";

export const getTacheService = async (): Promise<Tache[]> => {
  return await getTacheRepository();
};
