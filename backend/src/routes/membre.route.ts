import { Router } from 'express';
import {
  getMembresController,
  getMembresParIdController,
  putMembreController,
  postMembreController,
  deleteMembreController,
} from '../controllers/membre.controller';
import { requireAuth } from '../middlewares/requireAuth.middleware';

const router = Router();

router.use(requireAuth);
router.get('/', getMembresController);
router.get('/:id', getMembresParIdController);
router.put('/:id', putMembreController);
router.post('/', postMembreController);
router.delete('/:id', deleteMembreController);

export default router;
