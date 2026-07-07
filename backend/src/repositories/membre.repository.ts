import { pool } from "../config/client";
import { Membre } from "../types";

export async function getMembresRepository(): Promise<Membre[]> {
  const result = await pool.query<Membre>(
    `SELECT 
      u.nom AS "nomUtilisateur",
      o.nom AS "nomOrganisation",
      m.role
    FROM membre m
    JOIN utilisateur u ON u.id = m.utilisateur_id
    JOIN organisation o ON o.id = m.organisation_id
    ORDER BY m.id
    `,
  );
  return result.rows;
}

export async function getMembreParIdRepository(
  id: number,
): Promise<Membre | undefined> {
  const result = await pool.query(
    `SELECT 
      u.nom AS "nomUtilisateur",
      o.nom AS "nomOrganisation",
      m.role
    FROM membre m
    JOIN utilisateur u ON u.id = m.utilisateur_id
    JOIN organisation o ON o.id = m.organisation_id
    WHERE m.id = $1`,
    [id],
  );
  return result.rows[0];
}

export async function putMembreRepository(
  id: number,
  data: Partial<Membre>,
): Promise<Membre> {
  const result = await pool.query(
    `
    UPDATE membre
    SET organisation_id = COALESCE($1, organisation_id),
        utilisateur_id = COALESCE($2, utilisateur_id),
        role = COALESCE($3, role)
    WHERE id = $4
    RETURNING *;
    `,
    [data.organisation_id, data.utilisateur_id, data.role, id],
  );
  if (!result.rows[0]) {
    throw new Error("Echec de la modification");
  }
  return result.rows[0];
}
