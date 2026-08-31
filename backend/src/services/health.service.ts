import { pool } from '../config/client';

export type DbHealthResult = {
  connected: boolean;
  latencyMs: number;
};

export const checkDbConnection = async (): Promise<DbHealthResult> => {
  const start = Date.now();

  try {
    await pool.query('SELECT 1');
    return { connected: true, latencyMs: Date.now() - start };
  } catch {
    return { connected: false, latencyMs: Date.now() - start };
  }
};
