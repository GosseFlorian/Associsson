import "dotenv/config";
import { pool } from "./client";
import fs from "fs";

export async function seedUp() {
  const data = await fs.readFileSync("src/config/seedUp.sql", "utf8");
  await pool.query(data);
}
seedUp();
