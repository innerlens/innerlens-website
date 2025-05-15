import { clearElement, createElement } from "../util/dom.js";
import homeSection from "../sections/homeSection.js";
import myPersonalitySection from "../sections/myPersonalitySection.js";
import personalityInformationSection from "../sections/personalityInformationSection.js";

class LandingPage {
	constructor() {
		this.id = "landing-page";
		this.parentName = "main";
	}

	render() {
		const landingPage = createElement("section", { id: this.id });
		const parent = document.querySelector(this.parentName);

		clearElement(parent);
		parent.appendChild(landingPage);

		homeSection.render();
		myPersonalitySection.render();
		personalityInformationSection.render();
	}
}

const landingPage = new LandingPage();
export default landingPage;
export { LandingPage };
