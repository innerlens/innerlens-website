import express from "express";
import "dotenv/config";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// api routers
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

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client")));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/question", questionRouter);
app.use("/api/option", questionOptionRouter);
app.use("/api/dichotomy", dichotomyRouter);
app.use("/api/assessment", assessmentRouter);
app.use("/api/response", responseRouter);
app.use("/api/personality", personalityRouter);
app.use("/api/trait", traitRouter);

// fallback for frontend
app.use((req, res, next) => {
	if (req.path.startsWith("/api") || path.extname(req.path)) {
		return next();
	}
	if (req.path.startsWith("/login")) {
		res.sendFile(path.join(__dirname, "../client/login.html"));
	} else {
		res.sendFile(path.join(__dirname, "../client/index.html"));
	}
});

const PORT = 8080;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
