import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateUrlParams } from '../middleware/validateMiddleware.js';
import { getAllPersonalities, getPersonalityById, getPersonalityByCode } from '../controllers/personalityController.js';

export const personalityRouter = express.Router();
// personalityRouter.use(authMiddleware);

personalityRouter.get('/', getAllPersonalities);

personalityRouter.get('/:id', 
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),
  getPersonalityById
);

personalityRouter.get('/code/:code',
    validateUrlParams({
        code: { type: 'string', required: true }
      }),
      getPersonalityByCode
);