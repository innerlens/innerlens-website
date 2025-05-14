import AppEvent from "../enums/appEvent.js";
import router from "../router.js";

export const HomeSectionButtons = {
	signedIn: {
		class: "primary-button",
		text: "Start Personality Test",
		onClick: () => router.gotoTest(),
	},
	signedOut: {
		class: "primary-button",
		text: "Sign In to Take Test",
		onClick: () => console.log("Start Personality Test"),
	},
};

export const eventsToRender = new Set([
	AppEvent.USER_SIGNED_IN,
	AppEvent.USER_SIGNED_OUT,
]);
