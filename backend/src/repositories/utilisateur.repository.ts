import { pool } from "../config/client";
import { Utilisateur } from "../types";

export const getUtilisateursRepository = async (): Promise<Utilisateur[]> => {
  const result = await pool.query<Utilisateur>(
    `SELECT id, nom, email, date_inscription
    FROM utilisateur 
    ORDER BY id`,
  );
  return result.rows;
};

export const getUtilisateurIdRepository = async (
  id: number,
): Promise<Utilisateur | null> => {
  const result = await pool.query<Utilisateur>(
    `SELECT id, nom, email, date_inscription 
    FROM utilisateur 
    WHERE id = $1`,
    [id],
  );
  return result.rows[0] || null;
};

export const postUtilisateurRepository = async (
  data: Utilisateur,
): Promise<Utilisateur> => {
  const query = `INSERT INTO utilisateur (nom, email, mot_de_passe)
    VALUES ($1, $2, $3)
    RETURNING id, nom, email, date_inscription`;
  const values = [data.nom, data.email, data.mot_de_passe];
  const result = await pool.query<Utilisateur>(query, values);
  if (!result.rows[0]) {
    throw new Error("Échec de la création de l'utilisateur en base de données");
  }
  return result.rows[0];
};

export const putUtilisateurRepository = async (
  id: number,
  data: Partial<Utilisateur>,
): Promise<Utilisateur | null> => {
  const query = `
    UPDATE utilisateur
    SET nom = COALESCE($1, nom),
        email = COALESCE($2, email),
        mot_de_passe = COALESCE($3, mot_de_passe)
    WHERE id = $4
    RETURNING id, nom, email, date_inscription;
  `;
  const values = [data.nom, data.email, data.mot_de_passe, id];
  const result = await pool.query<Utilisateur>(query, values);
  return result.rows[0] || null;
};

export const deleteUtilisateurRepository = async (
  id: number,
): Promise<Utilisateur | null> => {
  const query = `DELETE FROM utilisateur
    WHERE id = $1
    RETURNING id, nom, email, date_inscription`;
  const result = await pool.query<Utilisateur>(query, [id]);
  return result.rows[0] || null;
};
