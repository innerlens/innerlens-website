import { AssessmentApi } from "../api/assessments.js";
import userApi from "../api/user.js";
import TestStatus from "../enums/testStatus.js";
import appState from "../state/appState.js";
import authService from "./authService.js";

class DataRetrievalService {
	constructor() {
		this.userId = null;
	}

	async init() {
		await this._retrieveId();
		if (!this.userId) return;

		this._retrieveLatestTestResult();
	}

	async _retrieveId() {
		const sub = authService.getGoogleSub();

		if (!sub) return;

		this.userId = await userApi.getUserIdFromSub(sub);

		if (!this.userId) authService.logout();
	}

	async _retrieveLatestTestResult() {
		const assessments = await AssessmentApi.getUserAssessments(this.userId);

		let testStatus = TestStatus.UNKNOWN;
		let userPersonality = null;

		if (!assessments || !assessments.length) {
			testStatus = TestStatus.NOT_STARTED;
		} else {
			const latestAssessment = assessments[assessments.length - 1];

			this.assessmentId = latestAssessment.id;

			if (!latestAssessment.completed_at) {
				testStatus = TestStatus.IN_PROGRESS;
			} else {
				testStatus = TestStatus.COMPLETED;
				const resposne = await AssessmentApi.getAssessmentResults(
					latestAssessment.id
				);

				userPersonality = resposne.personality_code;

				console.log(resposne);
			}
		}

		appState.setTestData({ testStatus, userPersonality });
	}
}

const dataRetrievalService = new DataRetrievalService();
export default dataRetrievalService;
