import express from 'express'
import { getGoogleJwt } from '../controllers/authController.js';
import { validateRequestBody } from '../middleware/validateMiddleware.js';

export const authRouter = express.Router();

/* Auth routes */

authRouter.post(
    '/', 
    validateRequestBody({code: { type: 'string', required: true }}), 
    getGoogleJwt
);