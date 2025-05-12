import { HomeSection } from "./sections/home_section.js";
import { MyPersonalitySection } from "./sections/my_personality_section.js";
import { PersonalityTypesSection } from "./sections/personality_types_section.js";

export const LandingPage = {
	render() {
		const landingPage = document.createElement("section");
		landingPage.id = "landing-page";

		const parent = document.querySelector("main");
		parent.innerHTML = "";
		parent.appendChild(landingPage);

		HomeSection.render();
		MyPersonalitySection.render();
		PersonalityTypesSection.render();
	},
};
