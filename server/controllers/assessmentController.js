import { assessmentRepository } from "../repositories/assessmentRepository.js";
import { questionRepository } from "../repositories/questionRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { assessmentResponseRepository } from "../repositories/assessmentResponseRepository.js";
import { dichotomyRepository } from "../repositories/dichotomyRepository.js";
import { traitRepository } from "../repositories/traitRepository.js";
import { HTTP_STATUS } from "../utils/httpStatus.js";

export async function getAssessmentById(req, res) {
	try {
		const assessment = await assessmentRepository.findById(
			parseInt(req.params.id)
		);
		if (!assessment)
			return res
				.status(HTTP_STATUS.NOT_FOUND)
				.json({ error: "Assessment not found" });
		res.status(HTTP_STATUS.OK).json(assessment);
	} catch (err) {
		console.error("Get assessment failed:", err.message);
		return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			error: "Could not retrieve assessment",
			detail: err.message,
		});
	}
}

export async function getAssessmentsByUserId(req, res) {
	try {
		const assessments = await assessmentRepository.findAllByKey(
			"user_id",
			parseInt(req.params.id)
		);
		res.status(HTTP_STATUS.OK).json(assessments);
	} catch (err) {
		console.error("Get assessments by user failed:", err.message);
		return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			error: "Could not retrieve user's assessments",
			detail: err.message,
		});
	}
}

export async function getCurrentUserAssessmentByUserId(req, res) {
	try {
		const assessment =
			await assessmentRepository.findCurrentAssessmentByUserId(
				parseInt(req.params.id)
			);
		if (!assessment)
			return res
				.status(HTTP_STATUS.NOT_FOUND)
				.json({ error: "User does not have ongoing assessment" });
		res.status(HTTP_STATUS.OK).json(assessment);
	} catch (err) {
		console.error("Get assessment by user failed:", err.message);
		return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			error: "Could not retrieve user's assessment",
			detail: err.message,
		});
	}
}

export async function createAssessment(req, res) {
	try {
		const { user_id } = req.body;

		if (!(await userRepository.findById(user_id))) {
			return res
				.status(HTTP_STATUS.NOT_FOUND)
				.json({ error: "User does not exist" });
		}

		// check for ongoing assessment
		if (await assessmentRepository.findCurrentAssessmentByUserId(user_id)) {
			return res
				.status(HTTP_STATUS.CONFLICT)
				.json({ error: "User already has an uncompleted assessment" });
		}

		const assessment = await assessmentRepository.create({ user_id });
		res.status(HTTP_STATUS.CREATED).json(assessment);
	} catch (err) {
		console.error("Create assessment failed:", err.message);
		return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			error: "Could not create assessment",
			detail: err.message,
		});
	}
}

export async function completeAssessment(req, res) {
	try {
		const { id } = req.params;
		const { completed_at } = req.body;

		if (!(await assessmentRepository.findById(id))) {
			return res
				.status(HTTP_STATUS.NOT_FOUND)
				.json({ error: "Assessment does not exist" });
		}

		// ensure that assessment has all questions answered
		const responses = await assessmentResponseRepository.findAllByKey(
			"assessment_id",
			id
		);
		const questions = await questionRepository.findAll();
		console.log(`${responses.length} vs ${questions.length}`);
		if (responses.length !== questions.length)
			return res
				.status(HTTP_STATUS.FORBIDDEN)
				.json({ error: "Assessment is incomplete" });

		const updatedAssessment = await assessmentRepository.update(id, {
			completed_at,
		});
		res.status(HTTP_STATUS.OK).json(updatedAssessment);
	} catch (err) {
		console.error("Update assessment failed:", err.message);
		res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			error: "Could not update assessment",
			detail: err.message,
		});
	}
}

export async function getAssessmentResult(req, res) {
	try {
		const assessmentId = parseInt(req.params.id);

		const assessment = await assessmentRepository.findById(assessmentId);
		if (!assessment)
			return res
				.status(HTTP_STATUS.NOT_FOUND)
				.json({ error: "Assessment not found" });

		const responses = await assessmentResponseRepository.findAllByKey(
			"assessment_id",
			assessmentId
		);
		if (!responses.length)
			return res
				.status(HTTP_STATUS.NOT_FOUND)
				.json({ error: "No responses for this assessment" });

		const traitCounts = {};

		for (const response of responses) {
			if (response.question_option_id) {
				traitCounts[response.question_option_id] =
					(traitCounts[response.question_option_id] || 0) + 1;
			}
		}

		const dichotomies = await dichotomyRepository.findAll();
		const traits = await traitRepository.findAll();

		const traitMap = traits.reduce((map, trait) => {
			map[trait.id] = trait;
			return map;
		}, {});

		const breakdown = {};
		const codeLetters = [];

		for (const dichotomy of dichotomies) {
			const left = traitMap[dichotomy.left_trait_id];
			const right = traitMap[dichotomy.right_trait_id];

			const leftCount = traitCounts[left.id] || 0;
			const rightCount = traitCounts[right.id] || 0;

			breakdown[dichotomy.id] = {
				left_trait: {
					id: left.id,
					code: left.code,
					count: leftCount,
				},
				right_trait: {
					id: right.id,
					code: right.code,
					count: rightCount,
				},
			};

			codeLetters.push(leftCount >= rightCount ? left.code : right.code);
		}

		res.status(HTTP_STATUS.OK).json({
			breakdown,
			personality_code: codeLetters.join(""),
		});
	} catch (err) {
		console.error("Error generating result:", err.message);
		return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			error: "Could not compute assessment result",
			detail: err.message,
		});
	}
}
