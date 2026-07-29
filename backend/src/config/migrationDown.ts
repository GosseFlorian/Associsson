import "dotenv/config";
import { pool } from "./client";
import fs from "fs";

export async function migrationDown() {
  const data = await fs.readFileSync("src/config/migrationDown.sql", "utf8");
  await pool.query(data);
}
migrationDown();
