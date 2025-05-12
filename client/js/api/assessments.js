import ApiClient from "./api_client.js";
import {
	applyAuthChecktOMethods,
	withAuthorisationCheck,
} from "../utils/index.js";

// Assessment API - Handles all assessment-related endpoints
class AssessmentApi {
	static async getUserAssessments(userId) {
		return (await ApiClient.get(`/api/assessment/user/${userId}`)).json();
	}

	static async createAssessment(userId) {
		return (
			await ApiClient.post("/api/assessment", { user_id: userId })
		).json();
	}

	static async completeAssessment(assessmentId) {
		return (
			await ApiClient.patch(`/api/assessment/${assessmentId}`, {
				completed_at: new Date().toISOString(),
			})
		).json();
	}

	static async getAssessmentResults(assessmentId) {
		return (await ApiClient.get(`/result/${assessmentId}`)).json();
	}

	static async getPersonalityCodeInfo(personalityCode) {
		return (await ApiClient.get(`/code/${personalityCode}`)).json();
	}
}

// Question API - Handles questions and answers
class QuestionApi {
	static async getQuestionsWithOptions() {
		return await ApiClient.get("/api/question?includeOptions=true");
	}

	static async submitAnswer(assessmentId, questionId, questionOptionId) {
		return (
			await ApiClient.post("/api/response", {
				assessment_id: assessmentId,
				question_id: questionId,
				question_option_id: questionOptionId,
			})
		).json();
	}

	static async getAnsweredQuestions(assessmentId) {
		let response = await ApiClient.get(`/api/response/${assessmentId}`);
		if (response.status == 200) {
			return response;
		} else {
			return [];
		}
	}
}

// Integrated Assessment Flow Controller
class AssessmentFlow {
	static async initialize(userId) {
		try {
			// Get user's assessments
			const assessments = await AssessmentApi.getUserAssessments(userId);

			const ongoingAssessment = assessments.find(
				(assessment) => !assessment.completed_at
			);

			if (ongoingAssessment) {
				// Return ongoing assessment
				const question = await AssessmentFlow.getNextQuestion(
					ongoingAssessment.id
				);

				return {
					status: "ongoing",
					assessment: ongoingAssessment,
					question,
				};
			} else if (assessments.length > 0) {
				// Has completed assessments
				const results = await AssessmentFlow.getResults(assessments.id);

				return {
					status: "completed",
					assessments: assessments,
					results,
				};
			} else {
				// No assessments, create new one
				const newAssessment = await AssessmentApi.createAssessment(
					userId
				);
				return {
					status: "new",
					assessment: newAssessment,
				};
			}
		} catch (error) {
			console.error("Error initializing assessment flow:", error);
			throw error;
		}
	}

	// Get next question to answer for ongoing assessment
	static async getNextQuestion(assessmentId) {
		try {
			const allQuestions = await QuestionApi.getQuestionsWithOptions();

			// Get already answered questions for this assessment
			const answeredQuestions = await QuestionApi.getAnsweredQuestions(
				assessmentId
			);
			const answeredQuestionIds = answeredQuestions.map(
				(response) => response.question_id
			);

			// Find questions that haven't been answered yet
			const unansweredQuestions = allQuestions.filter(
				(question) => !answeredQuestionIds.includes(question.id)
			);

			// All questions answered
			if (unansweredQuestions.length === 0) {
				return null;
			}

			// Return a random unanswered question
			return unansweredQuestions[
				Math.floor(Math.random() * unansweredQuestions.length)
			];
		} catch (error) {
			console.error("Error getting next question:", error);
			throw error;
		}
	}

	// Submit answer and get next question
	static async answerQuestion(assessmentId, questionId, optionId) {
		try {
			await QuestionApi.submitAnswer(assessmentId, questionId, optionId);

			// Check if there are more questions
			const nextQuestion = await AssessmentFlow.getNextQuestion(
				assessmentId
			);

			if (!nextQuestion) {
				// All questions answered, mark assessment as complete

				await AssessmentApi.completeAssessment(assessmentId);
				return {
					status: "completed",
					assessmentId,
				};
			} else {
				return {
					status: "ongoing",
					nextQuestion,
				};
			}
		} catch (error) {
			console.error("Error answering question:", error);
			throw error;
		}
	}

	// Get assessment results
	static async getResults(assessmentId) {
		try {
			const results = await AssessmentApi.getAssessmentResults(
				assessmentId
			);

			// Get detailed information about the personality code
			const personalityInfo = await AssessmentApi.getPersonalityCodeInfo(
				results.personality_code
			);

			return {
				results,
				personalityInfo,
			};
		} catch (error) {
			console.error("Error getting assessment results:", error);
			throw error;
		}
	}
}

applyAuthChecktOMethods(AssessmentApi, withAuthorisationCheck);
applyAuthChecktOMethods(AssessmentFlow, withAuthorisationCheck);
applyAuthChecktOMethods(QuestionApi, withAuthorisationCheck);

export { AssessmentApi, QuestionApi, AssessmentFlow };
