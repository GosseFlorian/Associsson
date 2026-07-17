import { pool } from "../config/client";
import { Organisation } from "../types";

export const getOrganisationIdRepository = async (
  id: number,
): Promise<Organisation | undefined> => {
  const result = await pool.query<Organisation>(
    "SELECT nom, date_creation, est_actif, proprietaire_id FROM organisation WHERE id = $1",
    [id],
  );

  return result.rows[0];
};
export const getOrganisationRepository = async (): Promise<Organisation[]> => {
  const result = await pool.query<Organisation>(
    "SELECT id, nom, date_creation, est_actif, proprietaire_id FROM organisation ORDER BY id",
  );
  return result.rows;
};

export const postOrganisationRepository = async (
  data: Organisation,
): Promise<Organisation> => {
  const query =
    "INSERT INTO organisation (nom, est_actif, proprietaire_id) VALUES ($1, $2, $3) RETURNING *";
  const values = [data.nom, data.est_actif, data.proprietaire_id];
  const result = await pool.query<Organisation>(query, values);

  if (!result.rows[0]) {
    throw new Error("Echec de la creation de l'organisation");
  }
  return result.rows[0];
};

export const putOrganisationRepository = async (
  id: number,
  data: Partial<Organisation>,
): Promise<Organisation> => {
  const query = `
    UPDATE organisation
    SET nom = COALESCE($1, nom),
        est_actif = COALESCE($2, est_actif),
        proprietaire_id = COALESCE($3, proprietaire_id)
    WHERE id = $4
    RETURNING *;
    `;

  const values = [data.nom, data.est_actif, data.proprietaire_id, id];
  const result = await pool.query<Organisation>(query, values);
  if (!result.rows[0]) {
    throw new Error("Echec de la modification");
  }

  return result.rows[0];
};

export const deleteOrganisationRepository = async (
  id: number,
): Promise<Organisation> => {
  const query = "DELETE FROM organisation WHERE id = $1 RETURNING *";
  const result = await pool.query<Organisation>(query, [id]);

  if (!result.rows[0]) {
    throw new Error("Echec de la modification");
  }

  return result.rows[0];
};
