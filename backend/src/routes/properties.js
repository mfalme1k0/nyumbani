import express from 'express';
import {
  createProperty,
  updateProperty,
  listProperties,
  getPropertyDetails
} from '../controllers/propertyController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { createPropertySchema, updatePropertySchema } from '../schemas/propertySchema.js';
import { validateBody } from '../middleware/validate.js';

const router = express.Router();

router.get('/', listProperties);
router.get('/:propertyId', getPropertyDetails);
router.post('/', authenticate, authorize('agent','admin'), validateBody(createPropertySchema), createProperty);
router.patch('/:propertyId', authenticate, authorize('agent','admin'), validateBody(updatePropertySchema), updateProperty);

export default router;
