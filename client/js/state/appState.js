import AppEvent from "../enums/appEvent.js";
import TestStatus from "../enums/testStatus.js";
import Page from "../enums/page.js";
import authService from "../services/authService.js";

class AppState {
	constructor() {
		this.state = {
			username: authService.getUsername(),
			isUserSignedIn: authService.isAuthenticated(),
			currentPage: Page.LANDING,
			testStatus: TestStatus.UNKNOWN,
			userPersonality: "ABCD",
		};
		this.listeners = [];
	}

	getState() {
		return { ...this.state };
	}

	subscribe(callback) {
		this.listeners.push(callback);
	}

	setPage(newPage) {
		if (this.state.currentPage !== newPage) {
			this.state = { ...this.state, currentPage: newPage };
			this._notify(AppEvent.PAGE_CHANGED);
		}
	}

	setTestData(testData) {
		this.state = { ...this.state, ...testData };
		this._notify(AppEvent.TEST_STATUS_CHANGED);
	}

	signIn(username) {
		if (!this.state.isUserSignedIn) {
			this.state = { ...this.state, username, isUserSignedIn: true };
			this._notify(AppEvent.USER_SIGNED_IN);
		}
	}

	signOut() {
		if (this.state.isUserSignedIn) {
			this.state = {
				...this.state,
				username: null,
				isUserSignedIn: false,
			};
			this._notify(AppEvent.USER_SIGNED_OUT);
		}
	}

	_notify(event) {
		this.listeners.forEach((callback) =>
			callback(event, { ...this.state })
		);
	}
}

const appState = new AppState();
export default appState;
