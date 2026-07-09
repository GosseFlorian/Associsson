import { pool } from "../config/client";
import { Tache } from "../types";

export const getTacheRepository = async (): Promise<Tache[]> => {
  const result = await pool.query<Tache>(
    "SELECT id, projet_id, titre, description, statut, priorite, date_echeance, assigne_a FROM tache ORDER BY id"
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
