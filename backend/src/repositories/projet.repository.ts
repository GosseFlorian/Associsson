import {pool} from "../config/client";
import {Projet} from "../types";

export const getProjetsRepository = async (): Promise<Projet[]> => {
    const result = await pool.query<Projet>(
        "SELECT organisation_id, createur_id, titre, description, date_creation, date_debut, date_fin, adresse, est_termine FROM projet ORDER BY id"
    );
    return result.rows;
};

export const getProjetByIdRepository = async (
    id: number,
): Promise<Projet | undefined> => {
    const result = await pool.query<Projet>(
        "SELECT organisation_id, createur_id, titre, description, date_creation, date_debut, date_fin, adresse, est_termine FROM projet WHERE id = $1",
        [id]        
    );
    return result.rows[0];
};
