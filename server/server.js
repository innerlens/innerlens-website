import 'dotenv/config'

import express from 'express';
import { authRouter } from './routers/authRouter.js';
import { userRouter } from './routers/userRouter.js';
import { questionRouter} from './routers/questionRouter.js'
import { questionOptionRouter } from './routers/questionOptionRouter.js';
import { dichotomyRouter } from './routers/dichotomyRouter.js';
import { personalityRouter } from './routers/personalityRouter.js';

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/question', questionRouter)
app.use('/api/option', questionOptionRouter)
app.use('/api/dichotomy', dichotomyRouter)
app.use('/api/personality', personalityRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
