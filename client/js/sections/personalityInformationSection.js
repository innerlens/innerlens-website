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

		const article =
			document.getElementById(this.id) ||
			createElement("article", { id: this.id });

		clearElement(article);
		if (!document.getElementById(this.id))
			document.getElementById(this.parentId).appendChild(article);

		const heading = createElement("h2", { text: this.heading });

		article.appendChild(heading);

		// get necessary information

		const updatedTypes = state.personalityTypes;
		const updatedTraits = state.personalityTraits;

		// display different traits
		const traitHeading = createElement("h3", {
			text: `8 Different Personality Traits`,
		});
		const br = createElement("br");

		article.appendChild(traitHeading);
		article.appendChild(br);

		updatedTraits.forEach((type) => {
			const traitName = createElement("em", { text: `${type.name}` });
			const trait = createElement("p", { text: `${type.description}` });
			article.appendChild(traitName);
			article.appendChild(trait);
			article.appendChild(br);
		});

		article.appendChild(br);

		// display personality types
		const personalityHeading = createElement("h3", {
			text: `16 Different Personality Types`,
		});

		article.appendChild(personalityHeading);
		article.appendChild(br);

		updatedTypes.forEach((type) => {
			const personality = createElement("p", {
				text: `${type.name} - ${type.code}`,
			});
			article.appendChild(personality);
		});

		article.appendChild(br);
	}

	_onStateChange(event, state) {
		if (eventsToRender.has(event)) {
			if (state.currentPage === Page.LANDING) this.render(state);
		}
	}
}

const personalityInformationSection = new InformationSection();
export default personalityInformationSection;
