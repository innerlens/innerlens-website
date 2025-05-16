import AppEvent from "../enums/appEvent.js";
import TestStatus from "../enums/testStatus.js";

export const HomeSectionItems = {
	[TestStatus.UNKNOWN]: {
		buttons: {
			class: "primary-button",
			text: "Start Personality Test",
			onClick: () => {},
		},
	},
	[TestStatus.NOT_STARTED]: {
		buttons: {
			class: "primary-button",
			text: "Start Personality Test",
			onClick: () =>
				import("../router.js").then((mod) => mod.default.newTest()),
		},
	},
	[TestStatus.IN_PROGRESS]: {
		buttons: {
			class: "primary-button",
			text: "Resume Personality Test",
			onClick: () =>
				import("../router.js").then((mod) =>
					mod.default.continueTest()
				),
		},
	},
	[TestStatus.COMPLETED]: {
		buttons: {
			class: "primary-button",
			text: "Retake Personality Test",
			onClick: () =>
				import("../router.js").then((mod) => mod.default.newTest()),
		},
	},
	signedOut: {
		buttons: {
			class: "primary-button",
			text: "Sign In to Take Test",
			onClick: () =>
				import("../router.js").then((mod) => mod.default.gotoSignIn()),
		},
	},
};

export const eventsToRender = new Set([
	AppEvent.USER_SIGNED_IN,
	AppEvent.USER_SIGNED_OUT,
	AppEvent.TEST_STATUS_CHANGED,
]);
