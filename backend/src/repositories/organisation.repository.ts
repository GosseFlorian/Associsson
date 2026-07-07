import { pool } from "../config/client";
import { Organisation } from "../types";

export const getOrganisationRepository = async (): Promise<Organisation[]> => {
  const result = await pool.query<Organisation>(
    "SELECT nom, date_creation, est_actif, proprietaire_id FROM organisation ORDER BY id",
  );
  return result.rows;
};
