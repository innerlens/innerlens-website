import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateUrlParams } from '../middleware/validateMiddleware.js';
import { getQuestionById, getAllQuestions } from '../controllers/questionController.js';

export const questionRouter = express.Router();
questionRouter.use(authMiddleware);

/* Question routes */

questionRouter.get('/', getAllQuestions);

questionRouter.get('/:id', 
  validateUrlParams({
    id: { type: 'string', required: true }
  }),
  getQuestionById
);