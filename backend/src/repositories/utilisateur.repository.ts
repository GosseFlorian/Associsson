import { pool } from "../config/client";
import { Utilisateur } from "../types";

export const getUtilisateursRepository = async (): Promise<Utilisateur[]> => {
  const result = await pool.query<Utilisateur>(
    "SELECT nom, email, date_inscription FROM utilisateur ORDER BY id",
  );
  return result.rows;
};
