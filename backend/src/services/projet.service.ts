import {Projet} from "../types";
import {getProjetsRepository} from "../repositories/projet.repository";

export const getProjetsService = async (): Promise<Projet[]> => {
    return await getProjetsRepository();
}