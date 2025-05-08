import express from 'express';
import {
  getAssessmentById,
  createAssessment,
  completeAssessment
} from '../controllers/assessmentController.js'

import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequestBody, validateUrlParams } from '../middleware/validateMiddleware.js';

export const assessmentRouter = express.Router();
// assessmentRouter.use(authMiddleware);

/* Assessment routes */

assessmentRouter.get('/:id', 
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),
  getAssessmentById
);

assessmentRouter.post(
  '/', 
  validateRequestBody({
    user_id: { type: 'string', required: true }
  }), 
  createAssessment
);

assessmentRouter.put(
  '/:id', 
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),
  validateRequestBody({
    completed_at: { type: 'date', required: true },
  }), 
  completeAssessment
);
