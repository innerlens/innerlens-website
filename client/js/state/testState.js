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

		const answeredQuestions = await QuestionApi.getAnsweredQuestions(
			dataRetrievalService.assessmentId
		);

		console.log(answeredQuestions);

		answeredQuestions.forEach((data, i) => {
			this.state.answeredQuestions[i] = {
				questionId: data.question_id,
				answerId: data.question_option_id,
				submitted: true,
			};
		});

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
			submitted: false,
		});

		this.state.answeredQuestions.sort(
			(a, b) => a.questionId - b.questionId
		);

		console.log(this.state);
	}

	allQuestionsAnswered() {
		const allAnswered =
			this.state.currentQuestionPage *
				this.state.currentQuestions.length ===
			this.state.answeredQuestions.length;

		if (!allAnswered) {
			alert(
				"You must answer all questions on this page before continuing."
			);
			return false;
		}

		return true;
	}

	goToNextPageIfComplete() {
		if (!this.allQuestionsAnswered()) return;

		const nextPageStartIndex = this.state.currentQuestionPage * 10;
		if (nextPageStartIndex < this.state.questions.length) {
			this.state.currentQuestionPage++;
			this._updateCurrentQuestionPage();
			this._notify(TestEvent.QUESTIONS_LOADED);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}

		this.submitAnswers();
		return;
	}

	completeTest() {
		if (!this.allQuestionsAnswered()) return;

		this.submitAnswers();

		AssessmentApi.completeAssessment(dataRetrievalService.assessmentId);
	}

	submitAnswers() {
		this.state.answeredQuestions.forEach((data) => {
			if (!data.submitted) {
				QuestionApi.submitAnswer(
					dataRetrievalService.assessmentId,
					data.questionId,
					data.answerId
				);
				data.submitted = true;
			}
		});
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
