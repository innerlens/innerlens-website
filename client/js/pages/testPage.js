import testState from "../state/testState.js";
import { clearElement, createElement } from "../util/dom.js";
import { eventsToRender } from "../config/testPageConfig.js";
import QuestionCard from "../config/questionCard.js";

class TestPage {
	constructor() {
		this.id = "test-page";
		this.parentName = "main";
		this.heading = "Personality Test";
		this.questionListId = "question-list";

		testState.subscribe(this._onStateChange.bind(this));
	}

	render(state) {
		state = state || testState.getState();

		const testPage = createElement("section", { id: this.id });
		const parent = document.querySelector("main");

		const heading = createElement("h2", { text: this.heading });
		const ul = createElement("ul", { id: this.questionListId });

		testPage.append(heading, ul);

		clearElement(parent);
		parent.appendChild(testPage);

		const questions = testState.getState().questions;

		if (!questions) return;

		console.log(questions);

		questions.map((data, index) => {
			const card = new QuestionCard(
				index,
				data.prompt,
				data.options,
				this._handleSelect.bind(this)
			);
			card.render();
			return card;
		});
	}

	_handleSelect(index, selectedOption) {
		console.log(`Q${index + 1}: ${selectedOption}`);
	}

	_onStateChange(event, state) {
		if (eventsToRender.has(event)) {
			this.render(state);
		}
	}
}

const testPage = new TestPage();
export default testPage;
