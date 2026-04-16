import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  createThread,
  listThreads,
  addComment,
  reportThread,
  reportComment
} from '../controllers/forumController.js';
import { validateBody } from '../middleware/validate.js';
import { forumThreadSchema, forumCommentSchema } from '../schemas/forumSchema.js';

const router = express.Router();

router.get('/threads', listThreads);
router.post('/threads', authenticate, authorize('tenant','agent','admin'), validateBody(forumThreadSchema), createThread);
router.post('/threads/:threadId/comments', authenticate, authorize('tenant','agent','admin'), validateBody(forumCommentSchema), addComment);
router.patch('/threads/:threadId/report', authenticate, authorize('tenant','agent','admin'), reportThread);
router.patch('/comments/:commentId/report', authenticate, authorize('tenant','agent','admin'), reportComment);

export default router;
