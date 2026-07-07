import { Tache } from "../types";
import {
  getTachesRepository,
  
} from "../repositories/tache.repository";

 

export const getTachesService = async (): Promise<Tache[]> => {
  return await getTachesRepository();
};
