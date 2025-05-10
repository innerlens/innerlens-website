import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

import { 
  validateRequestBody, 
  validateUrlParams 
} from '../middleware/validateMiddleware.js';

import { 
    getAssessmentResponseById,
    createAssessmentResponse,
    getAllAssessmentResponsesByAssessmentyId,
} from '../controllers/assessmentResponseController.js';

export const responseRouter = express.Router();
responseRouter.use(authMiddleware);

/* Assessment response routes */

responseRouter.get('/:id', 
  validateUrlParams({
    id: { type: 'integer', required: true }
  }),
  getAssessmentResponseById
);

responseRouter.get('/assessment/:id', 
    validateUrlParams({
      id: { type: 'integer', required: true }
    }),
    getAllAssessmentResponsesByAssessmentyId
  );

responseRouter.post(
  '/', 
  validateRequestBody({
    assessment_id: { type: 'integer', required: true },
    question_id: { type: 'integer', required: true },
    question_option_id: { type: 'integer', required: true },
  }), 
  createAssessmentResponse
);
