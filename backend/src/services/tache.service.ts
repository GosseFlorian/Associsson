import { Tache } from "../types";
import { getTachesRepository } from "../repositories/tache.repository";

export const getTachesService = async (): Promise<Tache[]> => {
  const taches = await getTachesRepository();

  return taches.sort((a, b) => {
    const ordre = { HAUTE: 3, MOYENNE: 2, BASSE: 1 };
    return ordre[b.priorite] - ordre[a.priorite];
  });
};
