import "dotenv/config";
import express from "express";
import cors from "cors";

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

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Le serveur est lancé sur : http://localhost:${PORT}`);
});
