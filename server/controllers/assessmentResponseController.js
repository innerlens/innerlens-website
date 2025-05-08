import { assessmentResponseRepository } from "../repositories/assessmentResponseRepository.js";
import { assessmentRepository } from "../repositories/assessmentRepository.js";
import { questionOptionRepository } from "../repositories/questionOptionRepository.js";
import { questionRepository } from "../repositories/questionRepository.js";
import { HTTP_STATUS } from '../utils/httpStatus.js';

export async function getAssessmentResponseById(req, res) {
  try {
    const response = await assessmentResponseRepository.findById(parseInt(req.params.id));
    if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Assessment response not found' });
    res.status(HTTP_STATUS.OK).json(response);

  } catch (err) {
    console.error('Get assessment response failed:', err.message);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not retrieve assessment response', detail: err.message });
  }
}

export async function getAllAssessmentResponsesByAssessmentyId(req, res) {
  try {
    const responses = await assessmentResponseRepository.findAllByKey('assessment_id', req.params.id);
    res.status(HTTP_STATUS.OK).json(responses);

  } catch (err) {
    console.error('Get assessment responses by assessment id failed:', err.message);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not fetch responses for assessment id', detail: err.message });
  }
}

export async function createAssessmentResponse(req, res) {
  try {
    const { assessment_id, question_id, question_option_id } = req.body;

    if (!await assessmentRepository.findById(assessment_id)) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Assessment does not exist' });
    }

    if (!await questionRepository.findById(question_id)) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Question does not exist' });
    }

    if (!await questionOptionRepository.findById(question_option_id)) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Question option does not exist' });
    }

    if (await assessmentResponseRepository.findResponseByAssessmentIdAndQuestionId(assessment_id, question_id)) {
      return res.status(HTTP_STATUS.CONFLICT).json({ error: 'Assessment response already exists for question id' });
    }

    const response = await assessmentResponseRepository.create({ assessment_id, question_id, question_option_id });
    res.status(HTTP_STATUS.CREATED).json(response);

  } catch (err) {
    console.error('Create user failed:', err.message);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not create assessment response', detail: err.message });
  }
}  