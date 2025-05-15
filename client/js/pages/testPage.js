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

		const questions = state.currentQuestions;

		const testPage = createElement("section", { id: this.id });
		const parent = document.querySelector("main");

		const heading = createElement("h2", { text: this.heading });
		const ul = createElement("ul", { id: this.questionListId });

		testPage.append(heading, ul);

		clearElement(parent);
		parent.appendChild(testPage);

		if (questions && questions.length) {
			console.log(state);

			questions.map((data) => {
				const card = new QuestionCard(
					data.id,
					data.prompt,
					data.options,
					this._handleSelect.bind(this)
				);
				card.render();
			});

			const button = createElement("button", {
				className: "primary-button",
				text: state.currentQuestionPage < 5 ? "Next" : "Submit",
				events: {
					["click"]: this._handleNextButtonClick,
				},
			});

			testPage.appendChild(button);
		} else {
			const loadingText = createElement("p", {
				text: "Loading questions",
			});

			testPage.appendChild(loadingText);
		}
	}

	_handleSelect(index, selectedOption) {
		console.log(`Q${index}: ${selectedOption}`);

		const [questionId, traidId] = selectedOption.split("-").map(Number);

		testState.answerQuestion(questionId, traidId);
	}

	_handleNextButtonClick() {
		if (testState.getState().currentQuestionPage < 5) {
			testState.goToNextPageIfComplete();
		} else {
			testState.completeTest();
		}
	}

	_onStateChange(event, state) {
		if (eventsToRender.has(event)) {
			this.render(state);
		}
	}
}

const testPage = new TestPage();
export default testPage;
export { TestPage };
