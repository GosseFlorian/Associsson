import { pool } from "../config/client";

import { Tache } from "../types";

export const getTachesRepository = async (): Promise<Tache[]> => {
  const result = await pool.query<Tache>(
    `SELECT
      id,
      projet_id,
      titre,
      description,
      statut,
      priorite,
      date_echeance,
      assigne_a
    FROM tache
    ORDER BY id`
  );

  return result.rows;
};
