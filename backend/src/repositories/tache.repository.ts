import { pool } from "../config/client";
import { Tache, TacheDetails } from "../types";

export const getTachesRepository = async (): Promise<TacheDetails[]> => {
  const result = await pool.query<TacheDetails>(
    `SELECT 
      t.id, 
      t.projet_id, 
      p.titre AS "nomProjet",
      t.titre, 
      t.description, 
      t.statut, 
      t.priorite, 
      t.date_echeance, 
      t.assigne_a,
      u.nom AS "nomAssigneA"
    FROM tache t
    LEFT JOIN projet p ON t.projet_id = p.id
    LEFT JOIN membre m ON t.assigne_a = m.id
    LEFT JOIN utilisateur u ON m.utilisateur_id = u.id
    ORDER BY t.id`,
  );
  return result.rows;
};

export const getTacheByIdRepository = async (
  id: number,
): Promise<TacheDetails | null> => {
  const result = await pool.query<TacheDetails>(
    `SELECT 
      t.id, 
      t.projet_id, 
      p.titre AS "nomProjet",
      t.titre, 
      t.description, 
      t.statut, 
      t.priorite, 
      t.date_echeance, 
      t.assigne_a,
      u.nom AS "nomAssigneA"
    FROM tache t
    LEFT JOIN projet p ON t.projet_id = p.id
    LEFT JOIN membre m ON t.assigne_a = m.id
    LEFT JOIN utilisateur u ON m.utilisateur_id = u.id
    WHERE t.id = $1`,
    [id],
  );
  return result.rows[0] || null;
};

export const postTacheRepository = async (data: Tache): Promise<Tache> => {
  const query = `
    INSERT INTO tache (titre, description, statut, priorite, date_echeance, assigne_a, projet_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, titre, description, statut, priorite, date_echeance, assigne_a, projet_id;
  `;
  const values = [
    data.titre,
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
): Promise<Tache | null> => {
  const query = `
    UPDATE tache
    SET titre = COALESCE($1, titre),
        description = COALESCE($2, description),
        statut = COALESCE($3, statut),
        priorite = COALESCE($4, priorite),
        date_echeance = COALESCE($5, date_echeance),
        assigne_a = COALESCE($6, assigne_a),
        projet_id = COALESCE($7, projet_id)
    WHERE id = $8
    RETURNING id, titre, description, statut, priorite, date_echeance, assigne_a, projet_id;
  `;
  const values = [
    data.titre,
    data.description,
    data.statut,
    data.priorite,
    data.date_echeance,
    data.assigne_a,
    data.projet_id,
    id,
  ];
  const result = await pool.query<Tache>(query, values);
  return result.rows[0] || null;
};

export const deleteTacheRepository = async (
  id: number,
): Promise<Tache | null> => {
  const query = `DELETE FROM tache 
    WHERE id = $1 
    RETURNING id, titre, description, statut, priorite, date_echeance, assigne_a, projet_id`;
  const result = await pool.query<Tache>(query, [id]);
  return result.rows[0] || null;
};
