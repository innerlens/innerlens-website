import AppEvent from "../enums/appEvent.js";
import TestStatus from "../enums/testStatus.js";
import appState from "../state/appState.js";

export const MyPersonalitySectionItems = {
	signedOut: {
		paragraph: {
			class: "info",
			text: () => "Only signed in users can see their personality type",
		},
		button: {
			class: "primary-button",
			text: "Sign In to Discover Personality",
			onClick: () =>
				import("../router.js").then((mod) => mod.default.gotoSignIn()),
		},
	},
	[TestStatus.UNKNOWN]: {
		paragraph: {
			class: "info",
			text: () => "Retrieving the latest data...",
		},
	},
	[TestStatus.NOT_STARTED]: {
		paragraph: {
			class: "info",
			text: () => "You haven't taken the personality test yet",
		},
		button: {
			class: "primary-button",
			text: "Take the Test",
			onClick: () =>
				import("../router.js").then((mod) => mod.default.newTest()),
		},
	},
	[TestStatus.IN_PROGRESS]: {
		paragraph: {
			class: "info",
			text: () => "You have a test that is still in progress",
		},
		button: {
			class: "primary-button",
			text: "Resume Personality Test",
			onClick: () =>
				import("../router.js").then((mod) =>
					mod.default.continueTest()
				),
		},
	},
	[TestStatus.COMPLETED]: {
		paragraph: {
			class: "info",
			text: () => {
				return `Your personality type is`;
			},
		},
		code: {
			id: "code-text",
			text: () => {
				return appState.getState().userPersonality;
			},
		},
		alias: {
			id: "alias-text",
			text: () => {
				return appState.getState().personalityAlias;
			},
		},
		description: {
			id: "description-text",
			text: () => {
				return appState.getState().personalityDescription;
			},
		},

		button: {
			class: "primary-button",
			text: "Retake the Test",
			onClick: () =>
				import("../router.js").then((mod) => mod.default.newTest()),
		},
	},
};

export const eventsToRender = new Set([
	AppEvent.USER_SIGNED_IN,
	AppEvent.USER_SIGNED_OUT,
	AppEvent.TEST_STATUS_CHANGED,
]);
