import express from 'express';
import {
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';

export const userRouter = express.Router();

userRouter.use(authMiddleware); // protect all routes

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
