import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateUrlParams } from '../middleware/validateMiddleware.js';
import { getAllTraits, getTraitById, getTraitByCode } from '../controllers/traitController.js';

export const traitRouter = express.Router();
// traitRouter.use(authMiddleware);

traitRouter.get('/', getAllTraits);

traitRouter.get('/:id', 
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),
  getTraitById
);

traitRouter.get('/code/:code',
    validateUrlParams({
        code: { type: 'string', required: true }
      }),
      getTraitByCode
);