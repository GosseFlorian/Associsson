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
        "SELECT id, organisation_id, createur_id, titre, description, date_creation, date_debut, date_fin, adresse, est_termine FROM projet ORDER BY id"
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
        SET organisation_id = COALESCE($1, organisation_id),
            createur_id     = COALESCE($2, createur_id),
            titre           = COALESCE($3, titre),
            description     = COALESCE($4, description),
            date_debut      = COALESCE($5, date_debut),
            date_fin        = COALESCE($6, date_fin),
            adresse         = COALESCE($7, adresse),
            est_termine     = COALESCE($8, est_termine)
        WHERE id = $9
        RETURNING *;
    `

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

export const deleteProjetRepository = async (id: number): Promise<Projet> => {
    const query = "DELETE FROM projet WHERE id = $1 RETURNING *";
    const result = await pool.query<Projet>(query, [id]);

    if (!result.rows[0]) {
        throw new Error("Projet non trouvé");
    }
    return result.rows[0];
};
