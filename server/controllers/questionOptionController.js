import { questionOptionRepository } from '../repositories/questionOptionRepository.js';
import { HTTP_STATUS } from '../utils/httpStatus.js';

export async function getQuestionOptionById(req, res) {
  try {
    const question = await questionOptionRepository.findById(parseInt(req.params.id));
    if (!question) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Question option not found' });
    res.status(HTTP_STATUS.OK).json(question);

  } catch (err) {
    console.error('Get question option failed:', err.message);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not retrieve question option', detail: err.message });
  }
}

export async function getAllQuestionOptions(req, res) {
  try {
    const questions = await questionOptionRepository.findAll();
    res.status(HTTP_STATUS.OK).json(questions);

  } catch (err) {
    console.error('Get question options failed:', err.message);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not fetch question options', detail: err.message });
  }
}

export async function getAllQuestionOptionsByQuestionId(req, res) {
  try {
    const questions = await questionOptionRepository.findAllByKey('question_id', req.params.id);
    res.status(HTTP_STATUS.OK).json(questions);

  } catch (err) {
    console.error('Get question options failed:', err.message);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not fetch question options', detail: err.message });
  }
}
