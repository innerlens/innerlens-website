import { AssessmentApi, QuestionApi } from "../api/assessments.js";
import AppEvent from "../enums/appEvent.js";
import Page from "../enums/page.js";
import TestEvent from "../enums/testEvent.js";
import dataRetrievalService from "../services/dataRetrievalService.js";
import appState from "./appState.js";

const PAGE_SIZE = 10;
const MAX_PAGES = 5;

class TestState {
	constructor() {
		this.#resetState();
		this.listeners = [];

		appState.subscribe(this.#onAppStateChange.bind(this));
	}

	#resetState() {
		this.state = {
			questions: [],
			answeredQuestions: new Map(),
			currentPageIndex: 0,
			currentQuestions: [],
		};
	}

	async initialise() {
		const [questions, answered] = await Promise.all([
			QuestionApi.getQuestionsWithOptions(),
			QuestionApi.getAnsweredQuestions(dataRetrievalService.assessmentId),
		]);

		answered.sort((a, b) => a.question_id - b.question_id);
		this.state.questions = questions;

		for (const { id, question_id, question_option_id } of answered) {
			this.state.answeredQuestions.set(question_id, {
				answerId: question_option_id,
				submitted: true,
				patch: false,
				referenceId: id,
			});
		}

		this.#updatePageIndex();
		this.setPage(this.state.currentPageIndex);

		console.log(this.state);
	}

	answerQuestion(questionId, answerId) {
		const exists = this.state.answeredQuestions.has(questionId);

		this.state.answeredQuestions.set(questionId, {
			answerId,
			submitted: exists,
			patch: exists,
		});

		this.state.answeredQuestions = new Map(
			[...this.state.answeredQuestions.entries()].sort(
				(a, b) => a[0] - b[0]
			)
		);

		this.#notify(TestEvent.QUESTION_ANSWERED);
		console.log(this.state);
	}

	allCurrentQuestionsAnswered() {
		return this.state.currentQuestions.every((q) =>
			this.state.answeredQuestions.has(q.id)
		);
	}

	goToNextPage() {
		if (!this.allCurrentQuestionsAnswered()) return false;

		this.#submitPendingAnswers();

		const nextPageIndex = this.state.currentPageIndex + 1;
		const totalPages = this.getTotalPages();

		if (nextPageIndex < totalPages) {
			this.setPage(nextPageIndex);
			return true;
		}

		this.completeTest();
		return false;
	}

	goToPreviousPage() {
		if (this.state.currentPageIndex > 0) {
			this.setPage(this.state.currentPageIndex - 1);
			return true;
		}
		return false;
	}

	setPage(index) {
		const totalPages = this.getTotalPages();
		if (index >= 0 && index < totalPages) {
			this.state.currentPageIndex = index;
			this.state.currentQuestions = this.getQuestionsForPage(index);
			this.#notify(TestEvent.QUESTIONS_LOADED);
		}
	}

	getQuestionsForPage(index) {
		const start = index * PAGE_SIZE;
		const end = start + PAGE_SIZE;
		return this.state.questions.slice(start, end);
	}

	getTotalPages() {
		return Math.ceil(this.state.questions.length / PAGE_SIZE);
	}

	async completeTest() {
		if (!this.allCurrentQuestionsAnswered()) return false;

		await this.#submitPendingAnswers();
		AssessmentApi.completeAssessment(dataRetrievalService.assessmentId);
		this.#notify(TestEvent.TEST_COMPLETED);
		return true;
	}

	saveProgress() {
		this.#submitPendingAnswers();
	}

	getState() {
		return {
			...this.state,
			answeredQuestions: Array.from(
				this.state.answeredQuestions.entries()
			),
		};
	}

	subscribe(callback) {
		this.listeners.push(callback);
	}

	async #submitPendingAnswers() {
		for (const [
			questionId,
			entry,
		] of this.state.answeredQuestions.entries()) {
			if (!entry.submitted) {
				const res = await QuestionApi.submitAnswer(
					dataRetrievalService.assessmentId,
					questionId,
					entry.answerId
				);
				entry.submitted = true;

				console.log(res);
			} else {
			}
		}
	}

	#updatePageIndex() {
		const answeredIds = [...this.state.answeredQuestions.keys()];
		const highestAnswered = answeredIds.length
			? Math.max(...answeredIds)
			: -1;

		let index = Math.floor(highestAnswered / PAGE_SIZE);
		index = Math.max(index, 0);
		index = Math.min(index, MAX_PAGES - 1);
		this.state.currentPageIndex = index;
	}

	#notify(event) {
		const snapshot = this.getState();
		this.listeners.forEach((callback) => callback(event, snapshot));
	}

	#onAppStateChange(event, state) {
		switch (event) {
			case AppEvent.USER_SIGNED_IN:
				if (state.currentPage == Page.TEST && state.isUserSignedIn) {
					this.initialise();
				}
				break;
			case AppEvent.USER_SIGNED_OUT:
				this.#resetState();
				break;
			case AppEvent.PAGE_CHANGED:
				if (state.currentPage == Page.TEST && state.isUserSignedIn) {
					this.initialise();
				}
				break;
		}
	}
}

const testState = new TestState();
export default testState;
