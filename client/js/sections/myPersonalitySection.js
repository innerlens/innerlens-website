import {
	eventsToRender,
	MyPersonalitySectionItems,
} from "../config/myPersonalitySectionConfig.js";
import appState from "../state/appState.js";
import { createElement, clearElement } from "../util/dom.js";

class MyPersonalitySection {
	constructor() {
		this.id = "my-personality";
		this.parentId = "landing-page";
		this.heading = "My Personality";

		appState.subscribe(this._onStateChange.bind(this));
	}

	render(state) {
		state = state || appState.getState();

		const items =
			MyPersonalitySectionItems[
				!state.isUserSignedIn ? "signedOut" : state.testStatus
			];

		const heading = createElement("h2", { text: this.heading });

		const article =
			document.getElementById(this.id) ||
			createElement("article", { id: this.id });

		clearElement(article);
		article.appendChild(heading);

		const paragraphObject = items.paragraph;
		const buttonObject = items.button;

		if (paragraphObject) {
			const paragraph = createElement("p", {
				text: paragraphObject.text?.(),
				className: paragraphObject.class,
			});

			article.appendChild(paragraph);
		}

		if (buttonObject) {
			const button = createElement("button", {
				className: buttonObject.class,
				text: buttonObject.text,
				events: {
					["click"]: buttonObject.onClick,
				},
			});

			article.appendChild(button);
		}

		document.getElementById(this.parentId).append(article);
	}

	_onStateChange(event, state) {
		if (eventsToRender.has(event)) {
			this.render(state);
		}
	}
}

const myPersonalitySection = new MyPersonalitySection();
export default myPersonalitySection;
