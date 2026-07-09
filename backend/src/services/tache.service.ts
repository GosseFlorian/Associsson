import { getTachesRepository } from "../repositories/tache.repository";
import { Tache } from "../types";

export const getTachesService = async (): Promise<Tache[]> => {
  return await getTachesRepository();
};
