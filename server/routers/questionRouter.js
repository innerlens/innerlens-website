import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateUrlParams } from '../middleware/validateMiddleware.js';
import { getQuestionById, getAllQuestions, getAllQuestionsByDichotomyId } from '../controllers/questionController.js';

export const questionRouter = express.Router();
// questionRouter.use(authMiddleware);

/* Question routes */

questionRouter.get('/', getAllQuestions);

questionRouter.get('/:id', 
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),
  getQuestionById
);

questionRouter.get('/dichotomy/:id',
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),
  getAllQuestionsByDichotomyId
)