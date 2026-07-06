import {pool} from "../config/client";
import {Projet} from "../types";

export const getProjetsRepository = async (): Promise<Projet[]> => {
    const result = await pool.query<Projet>(
        "SELECT id, organisation_id, createur_id, titre, description, date_creation, date_debut, date_fin, adresse, est_termine FROM projet ORDER BY id"
    );
    return result.rows;
}

