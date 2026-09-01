import { requireAuth } from '../middlewares/requireAuth.middleware';
import { Router } from 'express';
import {
  getTachesController,
  getTacheIdController,
  postTacheController,
  putTacheController,
  deleteTacheController,
} from '../controllers/tache.controller';

const router = Router();

router.use(requireAuth);
router.get('/', getTachesController);
router.get('/:id', getTacheIdController);
router.post('/', postTacheController);
router.put('/:id', putTacheController);
router.delete('/:id', deleteTacheController);
export default router;
