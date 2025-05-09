import express from 'express';
import {
  getAssessmentById,
  createAssessment,
  completeAssessment,
  getAssessmentsByUserId,
  getAssessmentResult
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

assessmentRouter.get('/user/:id', 
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),
  getAssessmentsByUserId
);

assessmentRouter.get('/result/:id', 
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),
    getAssessmentResult
);

assessmentRouter.post(
  '/', 
  validateRequestBody({
    user_id: { type: 'integer', required: true }
  }), 
  createAssessment
);

// Todo: Remove id from url since it can be retrieved from jwt when auth is added
assessmentRouter.patch(
  '/:id', 
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),
  validateRequestBody({
    completed_at: { type: 'date', required: true },
  }), 
  completeAssessment
);
