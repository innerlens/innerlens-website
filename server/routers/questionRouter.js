import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateUrlParams, validateQueryParams } from '../middleware/validateMiddleware.js';
import { getQuestionById, getAllQuestions, getAllQuestionsByDichotomyId } from '../controllers/questionController.js';

export const questionRouter = express.Router();
// questionRouter.use(authMiddleware);

/* Question routes */

questionRouter.get('/', getAllQuestions);

questionRouter.get('/:id', 
  validateUrlParams({id: { type: 'integer', required: true }}),
  validateQueryParams({ includeOptions: { type: 'string', required: false } }),
  getQuestionById
);

questionRouter.get('/dichotomy/:id',
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),
  getAllQuestionsByDichotomyId
)