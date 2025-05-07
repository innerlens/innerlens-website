import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateUrlParams } from '../middleware/validateMiddleware.js';
import { getQuestionOptionById, getAllQuestionOptions, getAllQuestionOptionsByQuestionId } from '../controllers/questionOptionController.js';

export const questionOptionRouter = express.Router();
// questionOptionRouter.use(authMiddleware);

/* Question option routes */

questionOptionRouter.get('/', getAllQuestionOptions);

questionOptionRouter.get('/:id', 
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),
  getQuestionOptionById
);

questionOptionRouter.get('/question/:id', 
    validateUrlParams({
      id: { type: 'integer', required: true }
    }),
    getAllQuestionOptionsByQuestionId
  );