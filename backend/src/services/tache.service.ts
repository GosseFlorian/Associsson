<<<<<<< HEAD
import { getTachesRepository } from "../repositories/tache.repository";
import { Tache } from "../types";

export const getTachesService = async (): Promise<Tache[]> => {
  return await getTachesRepository();
=======
import { getTacheRepository ,
   getTacheByIdRepository
 } from "../repositories/tache.repository";
import { Tache } from "../types";


export const getTacheService = async (): Promise<Tache[]> => {
  return await getTacheRepository();
>>>>>>> gettachebyid
};

export const getTacheIdService = async (
  id: number,
): Promise<Tache | undefined> => {
  return await getTacheByIdRepository(id);
};
