import appState from "../state/appState.js";
import Page from "../enums/page.js";
import { eventsToRender } from "../config/personalityInformationSection.js";
import {
	createElement,
	clearElement,
	removeElementWithId,
} from "../util/dom.js";

class InformationSection {
	constructor() {
		this.id = "information";
		this.parentId = "landing-page";
		this.heading = "Information";
		appState.subscribe(this._onStateChange.bind(this));
	}

	async render(state) {
		state = state || appState.getState();

		if (!state.isUserSignedIn) {
			removeElementWithId(this.id);
			return;
		}

		let article = document.getElementById(this.id);
		if (!article) {
			article = createElement("article", { id: this.id });
			document.getElementById(this.parentId).appendChild(article);
		}

		clearElement(article);

		const heading = createElement("h2", { text: this.heading });
		article.appendChild(heading);

		const traitsGrid = createElement("ul", { className: "grid" });
		const traitsHeading = createElement("h3", {
			text: "8 Different Personality Traits",
		});
		article.appendChild(traitsHeading);
		article.appendChild(traitsGrid);

		state.personalityTraits.forEach((trait) => {
			const card = createElement("li", {
				className: "card",
			});
			const title = createElement("h3", { text: trait.name });
			const description = createElement("p", { text: trait.description });
			card.appendChild(title);
			card.appendChild(description);
			traitsGrid.appendChild(card);
		});

		const typesGrid = createElement("ul", { className: "grid" });
		const typesHeading = createElement("h3", {
			text: "16 Different Personality Types",
		});
		article.appendChild(typesHeading);
		article.appendChild(typesGrid);

		state.personalityTypes.forEach((type) => {
			const card = createElement("li", {
				className: "card white-border center-text",
			});
			const code = createElement("strong", { text: type.code });
			const name = createElement("p", { text: type.name });
			card.appendChild(code);
			card.appendChild(name);
			typesGrid.appendChild(card);
		});
	}

	_onStateChange(event, state) {
		if (eventsToRender.has(event) && state.currentPage === Page.LANDING) {
			this.render(state);
		}
	}
}

const personalityInformationSection = new InformationSection();
export default personalityInformationSection;
