import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { authRouter } from "./routers/authRouter.js";
import { userRouter } from "./routers/userRouter.js";
import { questionRouter } from "./routers/questionRouter.js";
import { questionOptionRouter } from "./routers/questionOptionRouter.js";
import { dichotomyRouter } from "./routers/dichotomyRouter.js";
import { personalityRouter } from "./routers/personalityRouter.js";
import { traitRouter } from "./routers/traitRouter.js";
import { assessmentRouter } from "./routers/assessmentRouter.js";
import { responseRouter } from "./routers/assessmentResponseRouter.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "../client");

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/question", questionRouter);
app.use("/api/option", questionOptionRouter);
app.use("/api/dichotomy", dichotomyRouter);
app.use("/api/assessment", assessmentRouter);
app.use("/api/response", responseRouter);
app.use("/api/personality", personalityRouter);
app.use("/api/trait", traitRouter);

const PORT = process.env.PORT || 3000;

app.use(express.static(clientBuildPath));
app.get("*frontend", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
