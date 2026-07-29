import { pool } from "../config/client";
import { Membre, MembreDetails } from "../types";

export async function getMembresRepository(): Promise<MembreDetails[]> {
  const result = await pool.query<MembreDetails>(
    `SELECT 
      m.id,
      m.utilisateur_id,
      u.nom AS "nomUtilisateur",
      m.organisation_id,
      o.nom AS "nomOrganisation",
      m.role
    FROM membre m
    JOIN utilisateur u ON u.id = m.utilisateur_id
    JOIN organisation o ON o.id = m.organisation_id
    ORDER BY m.id`,
  );
  return result.rows;
}

export async function getMembreParIdRepository(
  id: number,
): Promise<MembreDetails | null> {
  const result = await pool.query<MembreDetails>(
    `SELECT 
      m.id,
      m.utilisateur_id,
      u.nom AS "nomUtilisateur",
      m.organisation_id,
      o.nom AS "nomOrganisation",
      m.role
    FROM membre m
    JOIN utilisateur u ON u.id = m.utilisateur_id
    JOIN organisation o ON o.id = m.organisation_id
    WHERE m.id = $1`,
    [id],
  );
  return result.rows[0] || null;
}

export async function postMembreRepository(data: Membre): Promise<Membre> {
  const result = await pool.query<Membre>(
    `INSERT INTO membre (utilisateur_id, organisation_id, role)
    VALUES ($1, $2, $3)
    RETURNING id, utilisateur_id, organisation_id, role`,
    [data.utilisateur_id, data.organisation_id, data.role ?? "licencie"],
  );
  if (!result.rows[0]) {
    throw new Error("Échec de la création du membre");
  }
  return result.rows[0];
}

export async function putMembreRepository(
  id: number,
  data: Partial<Membre>,
): Promise<Membre | null> {
  const result = await pool.query<Membre>(
    `
    UPDATE membre
    SET organisation_id = COALESCE($1, organisation_id),
        utilisateur_id = COALESCE($2, utilisateur_id),
        role = COALESCE($3, role)
    WHERE id = $4
    RETURNING id, utilisateur_id, organisation_id, role;
    `,
    [data.organisation_id, data.utilisateur_id, data.role, id],
  );
  return result.rows[0] || null;
}

export async function deleteMembreRepository(
  id: number,
): Promise<Membre | null> {
  const result = await pool.query<Membre>(
    `DELETE FROM membre
    WHERE id = $1
    RETURNING id, utilisateur_id, organisation_id, role`,
    [id],
  );

  return result.rows[0] || null;
}
