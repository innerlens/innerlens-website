import { setupBaseLayout } from "./util/dom.js";
import Logger from "./util/logger.js";
import appHeader from "./components/appHeader.js";
import backgroundCanvas from "./components/backgroundCanvas.js";
import authService from "./services/auth_service.js";
import { AssessmentApi, QuestionApi } from "./api/assessments.js";

Logger.setGlobalLevel(Logger.LEVELS.TRACE);

setupBaseLayout();

appHeader.render();
backgroundCanvas.render();

const id = await authService.init();

console.log(id);

let response = await AssessmentApi.getUserAssessments(id);

console.log(response);

response = await AssessmentApi.createAssessment(id);

console.log(response);
