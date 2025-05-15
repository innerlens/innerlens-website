import AppEvent from "../enums/appEvent.js";

export const HomeSectionItems = {
	signedIn: {
		buttons: {
			class: "primary-button",
			text: "Start Personality Test",
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
]);
