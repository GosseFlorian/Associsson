import "dotenv/config";
import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import type { Utilisateur } from "./types";
import { pool } from "./config/client";

const app = express();
const PORT = process.env.PORT ?? 3000;

// Autorise ton frontend (qui tourne sur le port 5173 ou autre) à appeler cette API
app.use(cors());

// Permet à Express de lire le format JSON envoyé dans les requêtes
app.use(express.json());

// Route de test ultra-simple
app.get("/", (req, res) => {
  res.json({ message: "Le backend fonctionne parfaitement ! 🚀" });
});

app.get("/utilisateur", getAllUtilisateur);

async function getAllUtilisateur(req: Request, res: Response) {
  try {
    const result = await pool.query<Utilisateur>(
      "SELECT * FROM utilisateur ORDER BY id",
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Le serveur est lancé sur : http://localhost:${PORT}`);
});
