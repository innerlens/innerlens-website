import { questionRepository } from '../repositories/questionRepository.js';
import { questionOptionRepository } from '../repositories/questionOptionRepository.js';
import { HTTP_STATUS } from '../utils/httpStatus.js';

export async function getQuestionById(req, res) {
  try {
    const questionId = parseInt(req.params.id);
    const includeOptions = req.query.includeOptions === 'true';

    const question = await questionRepository.findById(questionId);
    if (!question) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Question not found' });
    }

    if (includeOptions) {
      const options = await questionOptionRepository.findAllByKey('question_id', questionId);
      question.options = options;
    }

    res.status(HTTP_STATUS.OK).json(question);

  } catch (err) {
    console.error('Get question failed:', err.message);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not retrieve question', detail: err.message });
  }
}

export async function getAllQuestions(req, res) {
  try {
    const includeOptions = req.query.includeOptions === 'true';
    const questions = await questionRepository.findAll();

    if (includeOptions) {
      const allOptions = await questionOptionRepository.findAll();

      // group options by question_id
      const optionsByQuestionId = allOptions.reduce((acc, option) => {
        if (!acc[option.question_id]) acc[option.question_id] = [];
        acc[option.question_id].push(option);
        return acc;
      }, {});

      // attach options to questions
      for (const question of questions) {
        question.options = optionsByQuestionId[question.id] || [];
      }
    }

    res.status(HTTP_STATUS.OK).json(questions);

  } catch (err) {
    console.error('Get questions failed:', err.message);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not fetch questions', detail: err.message });
  }
}

export async function getAllQuestionsByDichotomyId(req, res) {
  try {
    const questions = await questionRepository.findAllByKey('dichotomy_id', req.params.id);
    res.status(HTTP_STATUS.OK).json(questions);

  } catch (err) {
    console.error('Get questions by dichotomy failed:', err.message);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not fetch questions for dichotomy', detail: err.message });
  }
}
