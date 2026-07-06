import { pool } from "../config/client";
import { Membre } from "../types";

export const getMembresRepository = async (): Promise<Membre[]> => {
  const result = await pool.query<Membre>(
    "SELECT organisation_id, utilisateur_id, role FROM membre ORDER BY id",
  );
  return result.rows;
};
