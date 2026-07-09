import { pool } from "../config/client";
import { Tache } from "../types";

export const getTacheRepository = async (): Promise<Tache[]> => {
  const result = await pool.query<Tache>(
    "SELECT id, projet_id, titre, description, statut, priorite, date_echeance, assigne_a FROM tache ORDER BY id",
  );

  return result.rows;
};

export const getTacheByIdRepository = async (
  id: number,
): Promise<Tache | undefined> => {
  const result = await pool.query<Tache>(
    "SELECT id, projet_id, titre, description, statut, priorite, date_echeance, assigne_a FROM tache WHERE id = $1",
    [id],
  );

  return result.rows[0]; // ✔ peut être undefined → cohérent avec ton modèle Utilisateur
};


export const postTacheRepository = async (data: Tache): Promise<Tache> => {
  const query = `
    INSERT INTO tache (projet_id, titre, description, statut, priorite, date_echeance, assigne_a)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    data.projet_id,
    data.titre,
    data.description,
    data.statut,
    data.priorite,
    data.date_echeance,
    data.assigne_a,
  ];

  const result = await pool.query<Tache>(query, values);

  if (!result.rows[0]) {
    throw new Error("Échec de la création de la tâche");
  }

  return result.rows[0];
};