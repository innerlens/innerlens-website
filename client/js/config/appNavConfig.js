import Page from "../enums/page.js";
import AppEvent from "../enums/appEvent.js";
import authService from "../services/authService.js";
import testState from "../state/testState.js";

export const AppNavItems = {
	[Page.LANDING]: {
		signedIn: {
			navLinks: ["home-link", "my-personality-link", "information-link"],
			buttons: ["sign-out-button"],
		},
		signedOut: {
			navLinks: ["home-link", "my-personality-link"],
			buttons: ["sign-in-button"],
		},
	},
	[Page.TEST]: {
		signedIn: {
			navLinks: ["home-link"],
			buttons: ["save-progress-button"],
		},
	},
};

export function getNavLinkById(id) {
	const navItems = {
		"home-link": { href: "home", text: "Home" },
		"my-personality-link": {
			href: "my-personality",
			text: "My Personality",
		},
		"information-link": {
			href: "information",
			text: "Information",
		},
	};
	return navItems[id] || null;
}

export function getButtonById(id) {
	const buttonItems = {
		"sign-in-button": {
			class: "secondary-button",
			text: "Sign In",
			onClick: () =>
				import("../router.js").then((mod) => mod.default.gotoSignIn()),
		},
		"sign-out-button": {
			class: "secondary-button",
			text: "Sign Out",
			onClick: () => authService.logout(),
		},
		"save-progress-button": {
			class: "secondary-button",
			text: "Save Progress",
			onClick: () => testState.saveProgress(),
		},
	};
	return buttonItems[id] || null;
}

export const eventsToRender = new Set([
	AppEvent.PAGE_CHANGED,
	AppEvent.USER_SIGNED_IN,
	AppEvent.USER_SIGNED_OUT,
]);
