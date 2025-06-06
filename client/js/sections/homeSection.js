import {
	HomeSectionItems,
	eventsToRender,
} from "../config/homeSectionConfig.js";
import { clearElement, createElement } from "../util/dom.js";
import appState from "../state/appState.js";
import Page from "../enums/page.js";

class HomeSection {
	constructor() {
		this.id = "home";
		this.parentId = "landing-page";

		appState.subscribe(this._onStateChange.bind(this));
	}

	render(state) {
		state = state || appState.getState();

		const article =
			document.getElementById(this.id) ||
			createElement("article", { id: this.id });

		clearElement(article);
		document.getElementById(this.parentId).prepend(article);

		const buttonObject =
			HomeSectionItems[
				!state.isUserSignedIn ? "signedOut" : state.testStatus
			].buttons;

		const button = createElement("button", {
			className: buttonObject.class,
			text: buttonObject.text,
			events: {
				["click"]: buttonObject.onClick,
			},
		});

		article.append(this._getSlogan(), button);
	}

	_getSlogan() {
		const p = createElement("p", { id: "slogan" });
		p.appendChild(createElement("em", { text: "Your personality" }));
		p.appendChild(createElement("br"));
		p.appendChild(document.createTextNode("decoded and reflected"));
		p.appendChild(createElement("br"));
		p.appendChild(createElement("em", { text: "through a clearer lens." }));

		return p;
	}

	_onStateChange(event, state) {
		if (eventsToRender.has(event)) {
			if (state.currentPage === Page.LANDING) this.render(state);
		}
	}
}

const homeSection = new HomeSection();
export default homeSection;
