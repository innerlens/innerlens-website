import { setupBaseLayout } from "./util/dom.js";
import Logger from "./util/logger.js";
import appHeader from "./components/appHeader.js";
import backgroundCanvas from "./components/backgroundCanvas.js";
import dataRetrievalService from "./services/dataRetrievalService.js";

Logger.setGlobalLevel(Logger.LEVELS.TRACE);

setupBaseLayout();

appHeader.render();
backgroundCanvas.render();

dataRetrievalService.init();
// console.log(id);

// let response = await AssessmentApi.getUserAssessments(id);

// console.log(response);

// response = await AssessmentApi.createAssessment(id);

// console.log(response);
