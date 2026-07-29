import "dotenv/config";
import { pool } from "./client";
import fs from "fs";

export async function migrationUp() {
  const data = await fs.readFileSync("src/config/migrationUp.sql", "utf8");
  await pool.query(data);
}
migrationUp();
