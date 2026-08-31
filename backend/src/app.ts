import 'dotenv/config';
import helmet from 'helmet';
import express from 'express';
import cors from 'cors';
import utilisateurRoutes from './routes/utilisateur.route';
import membreRoutes from './routes/membre.route';
import projetRoutes from './routes/projet.route';
import organisationRoutes from './routes/organisation.route';
import tacheRoutes from './routes/tache.route';
import healthRoutes from './routes/health.route';
import rateLimit from 'express-rate-limit';
import { config } from "dotenv-safe";
import { httpLogger } from './middlewares/httpLogger.middleware';
import { logger } from './lib/logger';

const app = express();
const PORT = process.env.PORT ?? 3000;
config();

app.use(httpLogger);
app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173'] }));
app.use(express.json());

app.use('/login', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // 100 requêtes max par IP sur la fenêtre
}));
app.use('/utilisateur', utilisateurRoutes);
app.use('/membre', membreRoutes);
app.use('/projet', projetRoutes);
app.use('/organisation', organisationRoutes);
app.use('/tache', tacheRoutes);
app.use('/health', healthRoutes);

// Lancement du serveur
app.listen(PORT, () => {
  logger.info({ port: PORT }, `Serveur lancé sur http://localhost:${PORT}`);
});
