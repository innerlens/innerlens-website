import appState from "../state/appState.js";
import PersonalityApi from "../api/personality.js"; // Import the new API
import Page from "../enums/page.js";
import { eventsToRender } from "../config/homeSectionConfig.js";
import { createElement, clearElement } from "../util/dom.js";

class PersonalityInformationSection {
	constructor() {
		this.id = "personality-information";
		this.parentId = "landing-page";
		this.heading = "Personality Types";

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

        const { personalityTypes } = state;

        if (!personalityTypes || personalityTypes.length === 0) {
            await this._loadPersonalityTypes();
        }

        const updatedTypes = appState.getState().personalityTypes;

        updatedTypes.forEach((type) => {

            const name = createElement("h3", { text: `${type.code} – ${type.name}` });
            const description = createElement("p", { text: type.description });
			const br = createElement("br")

            article.appendChild(name);
            article.appendChild(description);
			article.appendChild(br);
        });

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

	_onStateChange(event, state) {
		if (eventsToRender.has(event)) {
			if (state.currentPage === Page.LANDING) this.render(state);
		}
	}
}

const personalityInformationSection = new PersonalityInformationSection();
export default personalityInformationSection;
