import express from 'express';
import { register, login, me } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';
import { validateBody } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', authenticate, me);

export default router;
