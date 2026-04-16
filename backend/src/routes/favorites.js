import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { listFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController.js';
import { validateBody } from '../middleware/validate.js';
import { favoriteSchema } from '../schemas/favoriteSchema.js';

const router = express.Router();

router.use(authenticate, authorize('tenant','agent','admin'));
router.get('/', listFavorites);
router.post('/', validateBody(favoriteSchema), addFavorite);
router.delete('/:propertyId', removeFavorite);

export default router;
