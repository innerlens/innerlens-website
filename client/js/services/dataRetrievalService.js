import { AssessmentApi } from "../api/assessments.js";
import personalityApi from "../api/personality.js";
import userApi from "../api/user.js";
import TestStatus from "../enums/testStatus.js";
import appState from "../state/appState.js";
import authService from "./authService.js";

class DataRetrievalService {
	constructor() {
		this.userId = null;
		this.assessmentId = null;
	}

	async init() {
		await this._retrieveId();
		if (!this.userId) return;

		this._retrieveLatestTestResult();
		this._loadPersonalityTraits();
		this._loadPersonalityTypes();
	}

	async _retrieveId() {
		const sub = authService.getGoogleSub();

		if (!sub) return;

		this.userId = await userApi.getUserIdFromSub(sub);

		if (!this.userId) authService.logout();
	}

	async _loadPersonalityTypes() {
		try {
			const personalityTypes =
				await personalityApi.getAllPersonalityTypes();
			appState.setPersonalityTypes(personalityTypes);
		} catch (error) {
			console.error("Failed to load personality types:", error);
		}
	}

	async _loadPersonalityTraits() {
		try {
			const personalityTraits =
				await personalityApi.getAllPersonalityTraits();
			appState.setPersonalityTraits(personalityTraits);
		} catch (error) {
			console.error("Failed to load personality traits:", error);
		}
	}

	async _retrieveLatestTestResult() {
		const assessments = await AssessmentApi.getUserAssessments(this.userId);

		let testStatus = TestStatus.UNKNOWN;
		let userPersonality = null;

		if (!assessments || !assessments.length) {
			testStatus = TestStatus.NOT_STARTED;
		} else {
			assessments.sort((a, b) => {
				if (a.completed_at === null) return -1;
				if (b.completed_at === null) return 1;
				return new Date(b.completed_at) - new Date(a.completed_at);
			});

			console.log(assessments);

			const latestAssessment = assessments[0];

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
