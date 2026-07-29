import { pool } from "../config/client";
import { Organisation, OrganisationDetails } from "../types";

export const getOrganisationsRepository = async (): Promise<
  OrganisationDetails[]
> => {
  const result = await pool.query<OrganisationDetails>(
    `SELECT 
      o.id, 
      o.nom, 
      o.date_creation, 
      o.est_actif, 
      o.proprietaire_id,
      u.nom AS "nomProprietaire"
    FROM organisation o
    JOIN utilisateur u ON o.proprietaire_id = u.id
    ORDER BY o.id`,
  );
  return result.rows;
};

export const getOrganisationIdRepository = async (
  id: number,
): Promise<OrganisationDetails | null> => {
  const result = await pool.query<OrganisationDetails>(
    `SELECT 
      o.id, 
      o.nom, 
      o.date_creation, 
      o.est_actif, 
      o.proprietaire_id,
      u.nom AS "nomProprietaire"
    FROM organisation o
    JOIN utilisateur u ON o.proprietaire_id = u.id
    WHERE o.id = $1`,
    [id],
  );
  return result.rows[0] || null;
};

export const postOrganisationRepository = async (
  data: Organisation,
): Promise<Organisation> => {
  const query = `INSERT INTO organisation (nom, est_actif, proprietaire_id)
    VALUES ($1, $2, $3)
    RETURNING id, nom, est_actif, proprietaire_id`;
  const values = [data.nom, data.est_actif, data.proprietaire_id];
  const result = await pool.query<Organisation>(query, values);
  if (!result.rows[0]) {
    throw new Error("Echec de la création de l'organisation");
  }
  return result.rows[0];
};

export const putOrganisationRepository = async (
  id: number,
  data: Partial<Organisation>,
): Promise<Organisation | null> => {
  const query = `
    UPDATE organisation
    SET nom = COALESCE($1, nom),
        est_actif = COALESCE($2, est_actif),
        proprietaire_id = COALESCE($3, proprietaire_id)
    WHERE id = $4
    RETURNING id, nom, est_actif, proprietaire_id;
    `;
  const values = [data.nom, data.est_actif, data.proprietaire_id, id];
  const result = await pool.query<Organisation>(query, values);
  return result.rows[0] || null;
};

export const deleteOrganisationRepository = async (
  id: number,
): Promise<Organisation | null> => {
  const query = `DELETE FROM organisation
  WHERE id = $1
  RETURNING id, nom, est_actif, proprietaire_id`;
  const result = await pool.query<Organisation>(query, [id]);
  return result.rows[0] || null;
};
