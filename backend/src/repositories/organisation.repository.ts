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
