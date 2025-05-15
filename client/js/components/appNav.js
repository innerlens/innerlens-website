import appState from "../state/appState.js";
import {
	AppNavItems,
	getButtonById,
	getNavLinkById,
	eventsToRender,
} from "../config/appNavConfig.js";
import { createElement, removeElementWithId } from "../util/dom.js";

class AppNav {
	constructor() {
		this.id = "header-nav";
		this.parentName = "header";

		appState.subscribe(this._onStateChange.bind(this));
	}

	render(state) {
		state = state || appState.getState();

		const navItems =
			AppNavItems[state.currentPage] &&
			AppNavItems[state.currentPage][
				state.isUserSignedIn ? "signedIn" : "signedOut"
			];

		removeElementWithId(this.id);

		const nav = createElement("nav", { id: this.id });
		const ul = createElement("ul", { id: "header-ul" });

		navItems.navLinks.forEach((linkId) => {
			const li = createElement("li", { className: "nav-item" });
			const link = getNavLinkById(linkId);

			const linkElement = createElement("a", {
				id: linkId,
				className: `nav-link ${link.href}`,
				text: link.text,
				attributes: {
					href: `/#${link.href}`,
				},
			});

			li.appendChild(linkElement);
			ul.appendChild(li);
		});

		navItems.buttons.forEach((buttonId) => {
			const li = createElement("li", { className: "nav-item" });
			const button = getButtonById(buttonId);

			const buttonElement = createElement("button", {
				id: buttonId,
				className: button.class,
				text: button.text,
				events: {
					["click"]: button.onClick,
				},
			});

			li.appendChild(buttonElement);
			ul.appendChild(li);
		});

		nav.appendChild(ul);

		const parent = document.querySelector(this.parentName);
		parent.appendChild(nav);
	}

	_onStateChange(event, state) {
		if (eventsToRender.has(event)) {
			this.render(state);
		}
	}
}

const appNav = new AppNav();
export default appNav;
