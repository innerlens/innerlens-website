import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateUrlParams } from '../middleware/validateMiddleware.js';

import {
  getUserById,
  getUserByGoogleId
} from '../controllers/userController.js';

export const userRouter = express.Router();
userRouter.use(authMiddleware);

/* User routes */

userRouter.get('/:id', 
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),
  getUserById
);

userRouter.get('/google/:id', 
  validateUrlParams({
    id: { type: 'string', required: true }
  }),
  getUserByGoogleId
);