import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  reportIssue,
  listMaintenanceRequests,
  updateMaintenanceStatus
} from '../controllers/maintenanceController.js';
import { validateBody } from '../middleware/validate.js';
import { maintenanceSchema, maintenanceUpdateSchema } from '../schemas/maintenanceSchema.js';

const router = express.Router();

router.get('/', authenticate, authorize('agent','admin'), listMaintenanceRequests);
router.post('/', authenticate, authorize('tenant','agent'), validateBody(maintenanceSchema), reportIssue);
router.patch('/:requestId', authenticate, authorize('agent','admin'), validateBody(maintenanceUpdateSchema), updateMaintenanceStatus);

export default router;
