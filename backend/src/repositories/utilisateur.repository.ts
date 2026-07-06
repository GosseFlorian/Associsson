import { pool } from "../config/client";
import { Utilisateur } from "../types";

export const getUtilisateursRepository = async (): Promise<Utilisateur[]> => {
  const result = await pool.query<Utilisateur>(
    "SELECT nom, email, date_inscription FROM utilisateur ORDER BY id",
  );
  return result.rows;
};

export const getUtilisateurIdRepository = async (id: number): Promise<Utilisateur | null> => {
  const result = await pool.query<Utilisateur>(
    "SELECT nom, email, date_inscription FROM utilisateur WHERE id = $1", [id]
  );

  return result.rows[0] ?? null;
};

export const postUtilisateurRepository = async (data: Utilisateur): Promise<Utilisateur> => {
  const query = "INSERT INTO utilisateur (nom, email, mot_de_passe) VALUES ($1, $2, $3) RETURNING *";
  const values = [data.nom, data.email, data.mot_de_passe];
  const result = await pool.query<Utilisateur>(query, values);

  if (!result.rows[0]) {
    throw new Error("Échec de la création de l'utilisateur");
  }

  return result.rows[0];
}

export const patchUtilisateurRepository = async (id :number, data: Partial<Utilisateur>): Promise<Utilisateur> => {
  const patchSql = [];
  const values = [];
  let index = 1;

  for (const key in data){
    patchSql.push(`${key} = $${index}`);
    values.push((data as any)[key]);
    index++;
  }

  values.push(id)
  
  const query = `UPDATE utilisateur SET ${patchSql.join(", ")} WHERE id = $${index} RETURNING *`;
  const result = await pool.query<Utilisateur>(query, values);

  if (!result.rows[0]){
    throw new Error("Echec de la modification");
  }

  return result.rows[0];
}