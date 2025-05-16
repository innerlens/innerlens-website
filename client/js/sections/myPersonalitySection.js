import {
	eventsToRender,
	MyPersonalitySectionItems,
} from "../config/myPersonalitySectionConfig.js";
import Page from "../enums/page.js";
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

		const article =
			document.getElementById(this.id) ||
			createElement("article", { id: this.id });

		clearElement(article);
		if (!document.getElementById(this.id))
			document.getElementById(this.parentId).appendChild(article);

		const items =
			MyPersonalitySectionItems[
				!state.isUserSignedIn ? "signedOut" : state.testStatus
			];

		const heading = createElement("h2", { text: this.heading });

		article.appendChild(heading);

		const paragraphObject = items.paragraph;
		const buttonObject = items.button;
		const codeObject = items.code;
		const aliasObject = items.alias;
		const descriptionObject = items.description;

		if (paragraphObject) {
			const paragraph = createElement("p", {
				text: paragraphObject.text?.(),
				className: paragraphObject.class,
			});

			article.appendChild(paragraph);
		}

		if (codeObject) {
			const code = createElement("p", {
				text: codeObject.text?.(),
				id: codeObject.id,
			});

			article.appendChild(code);
		}

		if (aliasObject) {
			const alias = createElement("p", {
				text: aliasObject.text?.(),
				id: aliasObject.id,
			});

			article.appendChild(alias);
		}

		if (descriptionObject) {
			const description = createElement("p", {
				text: descriptionObject.text?.(),
				id: descriptionObject.id,
			});

			article.appendChild(description);
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
	}

	_onStateChange(event, state) {
		if (eventsToRender.has(event)) {
			if (state.currentPage === Page.LANDING) this.render(state);
		}
	}
}

const myPersonalitySection = new MyPersonalitySection();
export default myPersonalitySection;
export { MyPersonalitySection };
