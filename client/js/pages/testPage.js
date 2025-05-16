import testState from "../state/testState.js";
import { clearElement, createElement } from "../util/dom.js";
import { eventsToRender } from "../config/testPageConfig.js";
import QuestionCard from "../config/questionCard.js";
import router from "../router.js";

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
			const answeredQuestions = state.answeredQuestions;

			questions.forEach((data) => {
				const entry = answeredQuestions.find(
					([questionId]) => questionId === data.id
				);

				const answerId = entry ? entry[1].answerId : null;

				const card = new QuestionCard(
					data.id,
					data.prompt,
					data.options,
					answerId,
					this._handleSelect.bind(this)
				);
				card.render();
			});

			const button = createElement("button", {
				className: "primary-button",
				text: state.currentPageIndex < 4 ? "Next" : "Submit",
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
		const [questionId, traidId] = selectedOption.split("-").map(Number);

		testState.answerQuestion(questionId, traidId);
	}

	async _handleNextButtonClick() {
		if (testState.getState().currentPageIndex < 4) {
			testState.goToNextPage();
		} else {
			if (await testState.completeTest()) {
				router.gotoLanding();
				window.scrollTo({ top: 0, behavior: "smooth" });
				window.location.reload();
			}
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
