import appState from "../state/appState.js";
import PersonalityApi from "../api/personality.js"; // Import the new API
import Page from "../enums/page.js";
import { eventsToRender } from "../config/homeSectionConfig.js";
import { createElement, clearElement } from "../util/dom.js";

class InformationSection {
	constructor() {
		this.id = "information";
		this.parentId = "landing-page";
		this.heading = "Information";

		appState.subscribe(this._onStateChange.bind(this));
	}

    async render(state) {
        state = state || appState.getState();

        const heading = createElement("h2", { text: this.heading });

		const article =
			document.getElementById(this.id) ||
			createElement("article", { id: this.id });

		clearElement(article);
		article.appendChild(heading);

		// get necessary information

        const { personalityTypes, personalityTraits } = state;

        if (!personalityTypes || personalityTypes.length === 0) {
            await this._loadPersonalityTypes();
        }
        if (!personalityTraits || personalityTraits.length === 0) {
            await this._loadPersonalityTraits();
        }

        const updatedTypes = appState.getState().personalityTypes;
		const updatedTraits = appState.getState().personalityTraits;

		// display different traits
		const traitHeading = createElement("h3", { text: `8 Different Personality Traits` });
		const br = createElement("br")

		article.appendChild(traitHeading);
		article.appendChild(br);

        updatedTraits.forEach((type) => {
			const traitName = createElement("em", { text: `${type.name}`});
            const trait = createElement("p", { text: `${type.description}` });
			article.appendChild(traitName);
            article.appendChild(trait);
			article.appendChild(br);
        });

		article.appendChild(br);

		// display personality types
		const personalityHeading = createElement("h3", { text: `16 Different Personality Types` });

		article.appendChild(personalityHeading);
		article.appendChild(br);

        updatedTypes.forEach((type) => {
            const personality = createElement("p", { text: `${type.name} - ${type.code}` });
            article.appendChild(personality);
        });

		article.appendChild(br);
		document.getElementById(this.parentId).append(article);
    }

	async _loadPersonalityTypes() {
		try {
			const personalityTypes = await PersonalityApi.getAllPersonalityTypes();
			appState.setPersonalityTypes(personalityTypes);
		} catch (error) {
			console.error("Failed to load personality types:", error);
		}
	}

	async _loadPersonalityTraits() {
		try {
			const personalityTraits = await PersonalityApi.getAllPersonalityTraits();
			appState.setPersonalityTraits(personalityTraits);
		} catch (error) {
			console.error("Failed to load personality traits:", error);
		}
	}

	_onStateChange(event, state) {
		if (eventsToRender.has(event)) {
			if (state.currentPage === Page.LANDING) this.render(state);
		}
	}
}

const personalityInformationSection = new InformationSection();
export default personalityInformationSection;
