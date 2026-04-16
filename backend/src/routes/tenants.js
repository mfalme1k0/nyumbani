import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getTenantProfile,
  updateTenantProfile,
  getTenantLeases
} from '../controllers/tenantController.js';
import { validateBody } from '../middleware/validate.js';
import { tenantProfileSchema } from '../schemas/tenantSchema.js';

const router = express.Router();

router.get('/me', authenticate, authorize('tenant','agent','admin'), getTenantProfile);
router.patch('/me', authenticate, authorize('tenant','agent','admin'), validateBody(tenantProfileSchema), updateTenantProfile);
router.get('/:tenantId/leases', authenticate, authorize('agent','admin'), getTenantLeases);

export default router;
