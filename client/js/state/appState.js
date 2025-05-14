import AppEvent from "../enums/appEvent.js";
import TestStatus from "../enums/testStatus.js";
import Page from "../enums/page.js";

class AppState {
	constructor() {
		this.state = {
			username: null,
			isUserSignedIn: false,
			currentPage: Page.LANDING,
			testStatus: TestStatus.NOT_STARTED,
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
