import express from 'express';
import {
  getUserById,
  getUserByGoogleId,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequestBody, validateUrlParams } from '../middleware/validateMiddleware.js';

export const userRouter = express.Router();
// userRouter.use(authMiddleware);

/* User routes */

userRouter.get('/', getAllUsers);

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

userRouter.post(
  '/', 
  validateRequestBody({
    google_sub: { type: 'string', required: true },
    username: { type: 'string', required: true },
    email: { type: 'string', required: true },
  }), 
  createUser
);

userRouter.patch(
  '/:id', 
  validateRequestBody({
    username: { type: 'integer', required: false },
    email: { type: 'integer', required: false },
  }), 
  updateUser
);

userRouter.delete('/:id',
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),  
  deleteUser
);
