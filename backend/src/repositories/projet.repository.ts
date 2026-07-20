import { pool } from "../config/client";
import { Projet, ProjetDetails } from "../types";

export const getProjetsRepository = async (): Promise<ProjetDetails[]> => {
  const result = await pool.query<ProjetDetails>(
    `SELECT 
        p.id, 
        p.organisation_id, 
        o.nom AS "nomOrganisation",
        p.createur_id, 
        u.nom AS "nomCreateur",
        p.titre, 
        p.description, 
        p.date_creation, 
        p.date_debut, 
        p.date_fin, 
        p.adresse, 
        p.est_termine
        FROM projet p
        JOIN organisation o ON p.organisation_id = o.id
        JOIN membre m ON p.createur_id = m.id
        JOIN utilisateur u ON m.utilisateur_id = u.id
        ORDER BY p.id`,
  );
  return result.rows;
};

export const getProjetByIdRepository = async (
  id: number,
): Promise<ProjetDetails | null> => {
  const result = await pool.query<ProjetDetails>(
    `SELECT 
      p.id, 
      p.organisation_id, 
      o.nom AS "nomOrganisation",
      p.createur_id, 
      u.nom AS "nomCreateur",
      p.titre, 
      p.description, 
      p.date_creation, 
      p.date_debut, 
      p.date_fin, 
      p.adresse, 
      p.est_termine
    FROM projet p
    JOIN organisation o ON p.organisation_id = o.id
    JOIN membre m ON p.createur_id = m.id
    JOIN utilisateur u ON m.utilisateur_id = u.id
    WHERE p.id = $1`,
    [id],
  );
  return result.rows[0] || null;
};

export const postProjetRepository = async (data: Projet): Promise<Projet> => {
  const query = `
  INSERT INTO projet (organisation_id, createur_id, titre, description, date_debut, date_fin, adresse, est_termine)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
  RETURNING id, organisation_id, createur_id, titre, description, date_debut, date_fin, adresse, est_termine;
  `;
  const values = [
    data.organisation_id,
    data.createur_id,
    data.titre,
    data.description,
    data.date_debut,
    data.date_fin,
    data.adresse,
    data.est_termine,
  ];
  const result = await pool.query<Projet>(query, values);
  if (!result.rows[0]) {
    throw new Error("Échec de la création de Projet");
  }
  return result.rows[0];
};

export const putProjetRepository = async (
  id: number,
  data: Projet,
): Promise<Projet | null> => {
  const query = `
        UPDATE projet
        SET organisation_id = COALESCE($1, organisation_id),
            createur_id     = COALESCE($2, createur_id),
            titre           = COALESCE($3, titre),
            description     = COALESCE($4, description),
            date_debut      = COALESCE($5, date_debut),
            date_fin        = COALESCE($6, date_fin),
            adresse         = COALESCE($7, adresse),
            est_termine     = COALESCE($8, est_termine)
        WHERE id = $9
        RETURNING id, organisation_id, createur_id, titre, description, date_debut, date_fin, adresse, est_termine;
    `;
  const values = [
    data.organisation_id,
    data.createur_id,
    data.titre,
    data.description,
    data.date_debut,
    data.date_fin,
    data.adresse,
    data.est_termine,
    id,
  ];
  const result = await pool.query<Projet>(query, values);
  return result.rows[0] || null;
};

export const deleteProjetRepository = async (
  id: number,
): Promise<Projet | null> => {
  const query = `DELETE FROM projet
    WHERE id = $1
    RETURNING id, organisation_id, createur_id, titre, description, date_debut, date_fin, adresse, est_termine`;
  const result = await pool.query<Projet>(query, [id]);
  return result.rows[0] || null;
};
