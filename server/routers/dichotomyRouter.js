import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateUrlParams } from '../middleware/validateMiddleware.js';
import { getDichotomyById, getAllDichotomies } from '../controllers/dichotomyController.js';

export const dichotomyRouter = express.Router();
// dichotomyRouter.use(authMiddleware);

/* Dichotomy routes */

dichotomyRouter.get('/', getAllDichotomies);

dichotomyRouter.get('/:id', 
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),
  getDichotomyById
);