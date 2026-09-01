import { Router } from 'express';
import {
  postConnexionController,
  getUtilisateursController,
  getUtilisateurIdController,
  postUtilisateurController,
  putUtilisateurController,
  deleteUtilisateurController,
} from '../controllers/utilisateur.controller';
import { requireAuth } from '../middlewares/requireAuth.middleware';

const router = Router();

router.post('/connexion', postConnexionController);
router.post('/', postUtilisateurController);

router.use(requireAuth);
router.get('/', getUtilisateursController);
router.get('/:id', getUtilisateurIdController);
router.put('/:id', putUtilisateurController);
router.delete('/:id', deleteUtilisateurController);

export default router;
