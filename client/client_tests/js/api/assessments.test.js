import { jest } from '@jest/globals';
import { AssessmentApi, QuestionApi, AssessmentFlow } from "../../../js/api/assessments.js";
import ApiClient from "../../../js/api/apiClient.js";
import authService from "../../../js/services/authService.js";

ApiClient.get = jest.fn();
ApiClient.post = jest.fn();
ApiClient.patch = jest.fn();

authService.getAuthHeader = jest.fn(() => ({ Authorization: "Bearer test-token" }));
authService.getUserToken = jest.fn(() => "fake-token");

describe("AssessmentApi", () => {
	beforeEach(() => jest.clearAllMocks());

	test("getUserAssessments calls correct endpoint", async () => {
		ApiClient.get.mockResolvedValueOnce([{ id: 1 }]);

		const userId = 5;
		const res = await AssessmentApi.getUserAssessments(userId);

		expect(ApiClient.get).toHaveBeenCalledWith(`/api/assessment/user/${userId}`);
		expect(res).toEqual([{ id: 1 }]);
	});

	test("createAssessment calls correct endpoint", async () => {
		ApiClient.post.mockResolvedValueOnce({ id: 10 });

		const userId = 5;
		const res = await AssessmentApi.createAssessment(userId);

		expect(ApiClient.post).toHaveBeenCalledWith("/api/assessment", { user_id: userId });
		expect(res).toEqual({ id: 10 });
	});

	test("completeAssessment calls correct endpoint", async () => {
		ApiClient.patch.mockResolvedValueOnce({ success: true });

		const assessmentId = 3;
		const res = await AssessmentApi.completeAssessment(assessmentId);

		expect(ApiClient.patch).toHaveBeenCalledWith(
			`/api/assessment/${assessmentId}`,
			expect.objectContaining({ completed_at: expect.any(String) })
		);
		expect(res).toEqual({ success: true });
	});
});

describe("QuestionApi", () => {
	beforeEach(() => jest.clearAllMocks());

	test("getQuestionsWithOptions calls correct endpoint", async () => {
		ApiClient.get.mockResolvedValueOnce([{ id: 2 }]);

		const res = await QuestionApi.getQuestionsWithOptions();

		expect(ApiClient.get).toHaveBeenCalledWith("/api/question?includeOptions=true");
		expect(res).toEqual([{ id: 2 }]);
	});

	test("submitAnswer calls correct endpoint", async () => {
		ApiClient.post.mockResolvedValueOnce({ success: true });

		const data = {
			assessmentId: 1,
			questionId: 2,
			questionOptionId: 3,
		};
		const res = await QuestionApi.submitAnswer(data.assessmentId, data.questionId, data.questionOptionId);

		expect(ApiClient.post).toHaveBeenCalledWith("/api/response", {
			assessment_id: data.assessmentId,
			question_id: data.questionId,
			question_option_id: data.questionOptionId,
		});
		expect(res).toEqual({ success: true });
	});
});

describe("AssessmentFlow", () => {
	beforeEach(() => jest.clearAllMocks());

	test("initialize starts new assessment when none exist", async () => {
		ApiClient.get.mockResolvedValueOnce([]); 
		ApiClient.post.mockResolvedValueOnce({ id: 10 });

		const res = await AssessmentFlow.initialize(5);

		expect(res).toEqual({
			status: "new",
			assessment: { id: 10 },
		});
	});

	test("initialize returns ongoing assessment", async () => {
		const assessments = [{ id: 1, completed_at: null }];
		const question = { id: 2 };
		
		ApiClient.get
			.mockResolvedValueOnce(assessments) 
			.mockResolvedValueOnce([question])  
			.mockResolvedValueOnce([]);         

		const res = await AssessmentFlow.initialize(5);

		expect(res).toEqual({
			status: "ongoing",
			assessment: assessments[0],
			question: question,
		});
	});

	test("answerQuestion returns next question if available", async () => {
		const nextQuestion = { id: 4 };
		ApiClient.post.mockResolvedValueOnce({ success: true }); 
		ApiClient.get.mockResolvedValueOnce([nextQuestion]); 
		ApiClient.get.mockResolvedValueOnce([]);

		const res = await AssessmentFlow.answerQuestion(1, 2, 3);

		expect(ApiClient.post).toHaveBeenCalled();
		expect(res).toEqual({ status: "ongoing", nextQuestion });
	});

	test("getResults fetches results and personality info", async () => {
		const assessmentResults = { personality_code: "ABCD" };
		const personalityInfo = { details: "Test personality" };

		ApiClient.get
			.mockResolvedValueOnce(assessmentResults)
			.mockResolvedValueOnce(personalityInfo);

		const res = await AssessmentFlow.getResults(1);

		expect(ApiClient.get).toHaveBeenNthCalledWith(1, "/api/assessment/result/1");
		expect(ApiClient.get).toHaveBeenNthCalledWith(2, "/api/personality/code/ABCD");
		expect(res).toEqual({
			results: assessmentResults,
			personalityInfo,
		});
	});
});
