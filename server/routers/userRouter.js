import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const userRouter = express.Router();

userRouter.get('/user', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});