import { Router } from 'express';
import {
  getProjetsController,
  getProjetByIdController,
  postProjetController,
  putProjetController,
  deleteProjetController,
} from '../controllers/projet.controller';
import { requireAuth } from '../middlewares/requireAuth.middleware';

const router = Router();

router.use(requireAuth);
router.get('/', getProjetsController);
router.get('/:id', getProjetByIdController);
router.post('/', postProjetController);
router.put('/:id', putProjetController);
router.delete('/:id', deleteProjetController);
export default router;
