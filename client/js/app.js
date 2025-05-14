import { setupBaseLayout } from "./util/dom.js";
import Logger from "./util/logger.js";
import appHeader from "./components/appHeader.js";
import backgroundCanvas from "./components/backgroundCanvas.js";

Logger.setGlobalLevel(Logger.LEVELS.TRACE);

setupBaseLayout();

appHeader.render();
backgroundCanvas.render();
