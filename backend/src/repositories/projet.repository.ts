import { promises } from "node:dns";
import {pool} from "../config/client";
import {Projet} from "../types";

export const getProjetsRepository = async (): Promise<Projet[]> => {
    const result = await pool.query<Projet>(
        "SELECT id, organisation_id, createur_id, titre, description, date_creation, date_debut, date_fin, adresse, est_termine FROM projet ORDER BY id"
    );
    return result.rows;
}

export const getProjetByIdRepository = async (id: number): Promise<Projet | null> => {
    const result = await pool.query<Projet>(
        "SELECT id, organisation_id, createur_id, titre, description, date_creation, date_debut, date_fin, adresse, est_termine FROM projet WHERE id = $1",
        [id]        
    );
    return result.rows[0] ?? null;
};

export const createProjetRepository = async (projet: Omit<Projet, 'id' | 'date_creation'>): Promise<Projet> => {
    const result = await pool.query<Projet>(
        "INSERT INTO projet (organisation_id, createur_id, titre, description, date_debut, date_fin, adresse, est_termine) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [projet.organisation_id, projet.createur_id, projet.titre, projet.description, projet.date_debut, projet.date_fin, projet.adresse, projet.est_termine]
    );
    const createdProjet = result.rows[0];
    if (!createdProjet) {
        throw new Error("Échec de la création du projet");
    }
    return createdProjet;
};

export const updateProjetRepository = async (id: number, projet: Omit<Projet, 'id' | 'date_creation'>): Promise<Projet | null> => {
    const result =await pool.query<Projet>(
        "UPDATE projet SET organisation_id = $1, createur_id = $2, titre = $3, description = $4, date_debut = $5, date_fin = $6, adresse = $7, est_termine = $8 WHERE id = $9 RETURNING *",
        [projet.organisation_id, projet.createur_id, projet.titre, projet.description, projet.date_debut, projet.date_fin, projet.adresse, projet.est_termine, id]
    );
    return result.rows[0] ?? null
}