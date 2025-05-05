import express from 'express'
import { getGoogleJwt } from '../controllers/authController.js';

export const authRouter = express.Router();

authRouter.post('/', getGoogleJwt);
