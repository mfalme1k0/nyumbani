import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  listPayments,
  getPaymentById
} from '../controllers/paymentController.js';

const router = express.Router();

router.get('/', authenticate, authorize('agent','admin'), listPayments);
router.get('/:paymentId', authenticate, authorize('agent','admin'), getPaymentById);

export default router;
