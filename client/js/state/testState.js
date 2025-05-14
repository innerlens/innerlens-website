import { AssessmentApi, QuestionApi } from "../api/assessments.js";
import TestEvent from "../enums/testEvent.js";
import dataRetrievalService from "../services/dataRetrievalService.js";

class TestState {
	constructor() {
		this.state = {
			lastAnsweredQuestion: null,
			answeredQuestions: [],
			totalQuestions: 0,
			currentQuestionPage: 0,
			currentQuestions: [],
			questions: [],
		};

		this.listeners = [];
	}

	async updateQuestions() {
		this.state.questions = await QuestionApi.getQuestionsWithOptions();
		this.state.totalQuestions = this.state.questions.length;
		this._updateCurrentQuestionPage();
		this._notify(TestEvent.QUESTIONS_LOADED);
	}

	_updateCurrentQuestionPage() {
		const pageSize = 10;
		const lastIndex = this.state.lastAnsweredQuestion ?? -1;
		const nextPageStart = lastIndex + 1;
		const pageIndex = Math.floor(nextPageStart / pageSize);
		this.state.currentQuestionPage = pageIndex + 1;

		const start = pageIndex * pageSize;
		const end = start + pageSize;
		this.state.currentQuestions = this.state.questions.slice(start, end);
	}

	answerQuestion(questionId, traitId) {
		this.state.lastAnsweredQuestion = questionId;

		this.state.answeredQuestions = this.state.answeredQuestions.filter(
			(entry) => entry.questionId !== questionId
		);

		this.state.answeredQuestions.push({
			questionId,
			answerId: traitId,
		});

		console.log(this.state);
	}

	goToNextPageIfComplete() {
		// const answeredIds = new Set(
		// 	this.state.answeredQuestions.map((q) => q.questionId)
		// );
		// const allAnswered = this.state.currentQuestions.every((q) =>
		// 	answeredIds.has(q.id)
		// );

		const allAnswered =
			this.state.currentQuestionPage *
				this.state.currentQuestions.length ===
			this.state.answeredQuestions.length;

		if (!allAnswered) {
			alert(
				"You must answer all questions on this page before continuing."
			);
			return;
		}

		// Update to next page only if there are more questions
		const nextPageStartIndex = this.state.currentQuestionPage * 10;
		if (nextPageStartIndex < this.state.questions.length) {
			this.state.currentQuestionPage++;
			this._updateCurrentQuestionPage();
			this._notify(TestEvent.QUESTIONS_LOADED);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}

	completeTest() {
		this.state.answeredQuestions.forEach((data) => {
			QuestionApi.submitAnswer(
				dataRetrievalService.assessmentId,
				data.questionId,
				data.answerId
			);
		});

		AssessmentApi.completeAssessment(dataRetrievalService.assessmentId);
	}

	saveProgress() {
		AssessmentApi.completeAssessment(dataRetrievalService.assessmentId);
	}

	getState() {
		return { ...this.state };
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
