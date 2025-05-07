import { questionRepository } from '../repositories/questionRepository.js';
import { HTTP_STATUS } from '../utils/httpStatus.js';

export async function getQuestionById(req, res) {
  try {
    const question = await questionRepository.findById(parseInt(req.params.id));
    if (!question) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Question not found' });
    res.status(HTTP_STATUS.OK).json(question);

  } catch (err) {
    console.error('Get question failed:', err.message);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not retrieve question', detail: err.message });
  }
}

export async function getAllQuestions(req, res) {
  try {
    const questions = await questionRepository.findAll();
    res.status(HTTP_STATUS.OK).json(questions);

  } catch (err) {
    console.error('Get questions failed:', err.message);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not fetch questions', detail: err.message });
  }
}
