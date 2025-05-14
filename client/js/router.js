import Page from "./enums/page.js";
import landingPage from "./pages/landingPage.js";
import appState from "./state/appState.js";

class Router {
	constructor() {
		window.addEventListener("popstate", this._handleRoute.bind(this));
		this._handleRoute();
	}

	gotoTest() {
		const state = appState.getState();

		if (state.isUserSignedIn) {
			this._redirect(Page.TEST);
		} else {
			this._redirect("");
		}
	}

	_handleRoute() {
		const state = appState.getState();
		const path = window.location.pathname.slice(1) || Page.LANDING;

		const isValidPage = Object.values(Page).includes(path);
		const isRestricted = path === Page.TEST && !state.isUserSignedIn;

		if (!isValidPage || isRestricted) {
			this._redirect("");
			appState.setPage(Page.LANDING);

			return;
		}

		switch (path) {
			case Page.LANDING:
				landingPage.render();
				break;
			case Page.TEST:
				testPage.render();
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

export default new Router();
