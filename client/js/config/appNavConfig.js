import Page from "../enums/page.js";
import AppEvent from "../enums/appEvent.js";
import authService from "../services/authService.js";

export const AppNavItems = {
	[Page.LANDING]: {
		signedIn: {
			navLinks: [
				"home-link",
				"my-personality-link",
				"personality-types-link",
			],
			buttons: ["sign-out-button"],
		},
		signedOut: {
			navLinks: [
				"home-link",
				"my-personality-link",
				"personality-types-link",
			],
			buttons: ["sign-in-button"],
		},
	},
	[Page.TEST]: {
		signedIn: {
			navLinks: ["home-link"],
			buttons: ["sign-out-button"],
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
		"personality-types-link": {
			href: "personality-types",
			text: "Personality Types",
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
	};
	return buttonItems[id] || null;
}

export const eventsToRender = new Set([
	AppEvent.PAGE_CHANGED,
	AppEvent.USER_SIGNED_IN,
	AppEvent.USER_SIGNED_OUT,
]);
