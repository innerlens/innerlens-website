import { QuestionApi } from "../api/assessments.js";
import TestEvent from "../enums/testEvent.js";

class TestState {
	constructor() {
		this.state = {
			lastAnsweredQuestion: null,
			answeredQuestions: null,
			totalQuestions: null,
			currentQuestionPage: null,
			currentQuestions: null,
			questions: null,
		};

		this.listeners = [];
	}

	async updateQuestions() {
		this.state.questions = await QuestionApi.getQuestionsWithOptions();
		this._notify(TestEvent.QUESTIONS_LOADED);
	}

	getState() {
		return { ...this.state };
	}

	saveProgress() {
		console.log("Saving progress");
	}

	subscribe(callback) {
		this.listeners.push(callback);
	}

	_notify(event) {
		this.listeners.forEach((callback) =>
			callback(event, { ...this.state })
		);
	}
}

const testState = new TestState();
export default testState;
