import {pool} from "../config/client";
import {Projet} from "../types";

export const postProjetRepository= async(
    data: Projet,
): Promise<Projet> => {
    const query =
        "INSERT INTO projet (organisation_id, createur_id, titre, description, date_debut, date_fin, adresse, est_termine) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
    const values =    
        [   data.organisation_id,
            data.createur_id, 
            data.titre, 
            data.description,  
            data.date_debut, 
            data.date_fin, 
            data.adresse, 
            data.est_termine];
        
    const result = await pool.query<Projet>(query, values);

    if (!result.rows[0]) {
    throw new Error("Échec de la création de Projet");
    }
    return result.rows[0];
};
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

export const putProjetRepository = async (
    id: number,
    data: Projet,
): Promise<Projet> => {
    const query = `
        UPDATE projet
        SET organisation_id = $1,
            createur_id = $2,
            titre = $3,
            description = $4,
            date_debut = $5,
            date_fin = $6,
            adresse = $7,
            est_termine = $8
        WHERE id = $9
        RETURNING *`;
    const values = [
        data.organisation_id,
        data.createur_id,
        data.titre,
        data.description,
        data.date_debut,
        data.date_fin,
        data.adresse,
        data.est_termine,
        id,
    ];

    const result = await pool.query<Projet>(query, values);

    if (!result.rows[0]) {
        throw new Error("Projet non trouvé");
    }
    return result.rows[0];
};