import "dotenv/config";
import { pool } from "./client";
import fs from "fs";

export async function seedDown() {
  const data = await fs.readFileSync("src/config/seedDown.sql", "utf8");
  await pool.query(data);
}
seedDown();
