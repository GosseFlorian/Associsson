import "dotenv/config";
import express from "express";
import cors from "cors";
import utilisateurRoutes from "./routes/utilisateur.route";
import membreRoutes from "./routes/membre.route";
import projetRoutes from "./routes/projets.routes";
import tacheRoutes from "./routes/tache.route";



const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use("/utilisateur", utilisateurRoutes);
app.use("/membre", membreRoutes);
app.use("/projet", projetRoutes);
app.use("/tache", tacheRoutes);


// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Le serveur est lancé sur : http://localhost:${PORT}`);
});
