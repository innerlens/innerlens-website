import Page from "./enums/page.js";
import landingPage from "./pages/landingPage.js";
import testPage from "./pages/testPage.js";
import appState from "./state/appState.js";
import PATH from "./enums/path.js";
import { AssessmentApi } from "./api/assessments.js";
import dataRetrievalService from "./services/dataRetrievalService.js";

class Router {
	constructor() {
		window.addEventListener("popstate", this._handleRoute.bind(this));
		this._handleRoute();
	}

	continueTest() {
		const state = appState.getState();

		if (state.isUserSignedIn) {
			this._redirect(Page.TEST);
		} else {
			this._redirect("");
		}
	}

	async newTest() {
		const state = appState.getState();

		if (state.isUserSignedIn) {
			const response = await AssessmentApi.createAssessment(
				dataRetrievalService.userId
			);

			dataRetrievalService.assessmentId = response.id;
			this._redirect(Page.TEST);
		} else {
			this._redirect("");
		}
	}

	gotoLanding() {
		this._redirect("");
	}

	gotoSignIn() {
		const state = appState.getState();

		if (!state.isUserSignedIn) {
			window.location.href = PATH.AUTH_URI;
		}
	}

	_handleRoute() {
		const state = appState.getState();
		const path = window.location.pathname.slice(1) || Page.LANDING;

		const isValidPage = Object.values(Page).includes(path);
		const isRestricted = path === Page.TEST && !state.isUserSignedIn;

		if (!isValidPage || isRestricted) {
			this._redirect("");
			return;
		}

		switch (path) {
			case Page.LANDING:
				landingPage.render();
				break;
			case Page.TEST:
				testPage.render();
				break;
			default:
				console.log("womp womp");
		}

		appState.setPage(path);
	}

	_redirect(path) {
		window.history.replaceState({}, "", `/${path}`);
		this._handleRoute();
	}
}

const router = new Router();
export default router;
