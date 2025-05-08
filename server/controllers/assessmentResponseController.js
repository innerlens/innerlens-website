import { assessmentResponseRepository } from "../repositories/assessmentResponseRepository";
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
