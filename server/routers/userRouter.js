import express from 'express';
import {
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequestBody, validateUrlParams } from '../middleware/validateMiddleware.js';

export const userRouter = express.Router();
userRouter.use(authMiddleware);

/* User routes (Todo: Remove later, these are just for reference but won't be used by clients) */

userRouter.get('/', getAllUsers);

userRouter.get('/:id', 
  validateUrlParams({
    id: { type: 'string', required: true }
  }),
  getUserById
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

userRouter.put(
  '/:id', 
  validateRequestBody({
    username: { type: 'string', required: false },
    email: { type: 'string', required: false },
  }), 
  updateUser
);

userRouter.delete('/:id',
  validateUrlParams({
    id: { type: 'string', required: true }
  }),  
  deleteUser
);
