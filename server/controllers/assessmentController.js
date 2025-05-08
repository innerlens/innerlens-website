import { assessmentRepository } from '../repositories/assessmentRepository.js';
import { questionRepository } from '../repositories/questionRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { assessmentResponseRepository } from '../repositories/assessmentResponseRepository.js';
import { HTTP_STATUS } from '../utils/httpStatus.js';

export async function getAssessmentById(req, res) {
  try {
    const user = await assessmentRepository.findById(parseInt(req.params.id));
    if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Assessment not found' });
    res.status(HTTP_STATUS.OK).json(user);

  } catch (err) {
    console.error('Get assessment failed:', err.message);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not retrieve assessment', detail: err.message });
  }
}

export async function createAssessment(req, res) {
    try {
      const { user_id } = req.body;

      if (!await userRepository.findById(user_id)) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User does not exist' });
      }

      // check for ongoing assessment
      if (await assessmentRepository.findCurrentAssessmentByUserId(user_id)) {
        return res.status(HTTP_STATUS.CONFLICT).json({ error: 'User already has an uncompleted assessment' });
      }
  
      const user = await assessmentRepository.create({ user_id });
      res.status(HTTP_STATUS.CREATED).json(user);

    } catch (err) {
      console.error('Create assessment failed:', err.message);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not create assessment', detail: err.message });
    }
  }  

  export async function completeAssessment(req, res) {
    try {
      const { id } = req.params;
      
      if (!await assessmentRepository.findById(id)) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Assessment does not exist' });
      }

      const { completed_at } = req.body;

      // ensure that assessment has all questions answered
      const responses = await assessmentResponseRepository.findAllByKey('assessment_id', id);
      const questions = await questionRepository.findAll();

      if (responses.length !== questions.length) return res.status(HTTP_STATUS.FORBIDDEN).json({ error: 'Assessment is incomplete' });

      const updatedAssessment = await userRepository.update(id, { completed_at });  
      res.status(HTTP_STATUS.OK).json(updatedAssessment);

    } catch (err) {
      console.error('Update assessment failed:', err.message);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not update assessment', detail: err.message });
    }
  }  
