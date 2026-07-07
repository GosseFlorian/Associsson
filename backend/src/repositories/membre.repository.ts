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
