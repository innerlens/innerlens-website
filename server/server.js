import 'dotenv/config'

import express from 'express';
import { authRouter } from './routers/authRouter.js';
import { userRouter } from './routers/userRouter.js';

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
