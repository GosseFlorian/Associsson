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

export const putTacheRepository = async (
  id: number,
  data: Tache,
): Promise<Tache | undefined> => {
  const query = `
    UPDATE tache
    SET projet_id = $1,
        titre = $2,
        description = $3,
        statut = $4,
        priorite = $5,
        date_echeance = $6,
        assigne_a = $7
    WHERE id = $8
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
    id,
  ];

  const result = await pool.query<Tache>(query, values);

  return result.rows[0]; 
};
