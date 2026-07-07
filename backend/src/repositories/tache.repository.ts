import { pool } from "../config/client";
import { Tache } from "../types";

export const getTachesRepository = async (): Promise<Tache[]> => {
  const result = await pool.query<Tache>(
    "SELECT nom, description, statut, priorite, date_echeance, assigne_a, projet_id FROM tache ORDER BY id"
  );
  return result.rows;
};

export const getTacheIdRepository = async (
  id: number,
): Promise<Tache | undefined> => {
  const result = await pool.query<Tache>(
    "SELECT nom, description, statut, priorite, date_echeance, assigne_a, projet_id FROM tache WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export const postTacheRepository = async (
  data: Tache,
): Promise<Tache> => {
  const query = `
    INSERT INTO tache (nom, description, statut, priorite, date_echeance, assigne_a, projet_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [
    data.nom,
    data.description,
    data.statut,
    data.priorite,
    data.date_echeance,
    data.assigne_a,
    data.projet_id,
  ];

  const result = await pool.query<Tache>(query, values);

  if (!result.rows[0]) {
    throw new Error("Échec de la création de la tâche");
  }

  return result.rows[0];
};

export const putTacheRepository = async (
  id: number,
  data: Partial<Tache>,
): Promise<Tache> => {
  const query = `
    UPDATE tache
    SET nom = COALESCE($1, nom),
        description = COALESCE($2, description),
        statut = COALESCE($3, statut),
        priorite = COALESCE($4, priorite),
        date_echeance = COALESCE($5, date_echeance),
        assigne_a = COALESCE($6, assigne_a),
        projet_id = COALESCE($7, projet_id)
    WHERE id = $8
    RETURNING *;
  `;

  const values = [
    data.nom,
    data.description,
    data.statut,
    data.priorite,
    data.date_echeance,
    data.assigne_a,
    data.projet_id,
    id,
  ];

  const result = await pool.query<Tache>(query, values);

  if (!result.rows[0]) {
    throw new Error("Echec de la modification");
  }

  return result.rows[0];
};

export const deleteTacheRepository = async (
  id: number,
): Promise<Tache> => {
  const query = "DELETE FROM tache WHERE id = $1 RETURNING *";
  const result = await pool.query<Tache>(query, [id]);

  if (!result.rows[0]) {
    throw new Error("Echec de la suppression");
  }

  return result.rows[0];
};
