import { jest } from '@jest/globals';

const mockQuestionRepo = {
  findById: jest.fn(),
  findAll: jest.fn(),
  findAllByKey: jest.fn(),
};

const mockOptionRepo = {
  findAllByKey: jest.fn(),
  findAll: jest.fn(),
};

jest.unstable_mockModule('../../repositories/questionRepository.js', () => ({
  questionRepository: mockQuestionRepo,
}));
jest.unstable_mockModule('../../repositories/questionOptionRepository.js', () => ({
  questionOptionRepository: mockOptionRepo,
}));
jest.unstable_mockModule('../../utils/httpStatus.js', () => ({
  HTTP_STATUS: {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
}));

const {
  getQuestionById,
  getAllQuestions,
  getAllQuestionsByDichotomyId,
} = await import('../../controllers/questionController.js');

describe('questionController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Object.values(mockQuestionRepo).forEach(fn => fn.mockReset());
    Object.values(mockOptionRepo).forEach(fn => fn.mockReset());
  });

  test('getQuestionById returns 200 with question only', async () => {
    req.params.id = '1';
    req.query.includeOptions = 'false';
    const mockQuestion = { id: 1, text: 'Q?' };

    mockQuestionRepo.findById.mockResolvedValue(mockQuestion);

    await getQuestionById(req, res);

    expect(mockQuestionRepo.findById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockQuestion);
  });

  test('getQuestionById returns 200 with question and options', async () => {
    req.params.id = '1';
    req.query.includeOptions = 'true';

    const mockQuestion = { id: 1, text: 'Q?' };
    const options = [{ id: 10, question_id: 1 }, { id: 11, question_id: 1 }];

    mockQuestionRepo.findById.mockResolvedValue(mockQuestion);
    mockOptionRepo.findAllByKey.mockResolvedValue(options);

    await getQuestionById(req, res);

    expect(mockQuestionRepo.findById).toHaveBeenCalledWith(1);
    expect(mockOptionRepo.findAllByKey).toHaveBeenCalledWith('question_id', 1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ...mockQuestion, options });
  });

  test('getQuestionById returns 404 if question not found', async () => {
    req.params.id = '99';
    mockQuestionRepo.findById.mockResolvedValue(null);

    await getQuestionById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Question not found' });
  });

  test('getQuestionById returns 500 on error', async () => {
    req.params.id = '1';
    mockQuestionRepo.findById.mockRejectedValue(new Error('DB failed'));

    await getQuestionById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Could not retrieve question',
      detail: 'DB failed',
    });
  });

  test('getAllQuestions returns 200 without options', async () => {
    req.query.includeOptions = 'false';
    const questions = [{ id: 1 }, { id: 2 }];
    mockQuestionRepo.findAll.mockResolvedValue(questions);

    await getAllQuestions(req, res);

    expect(mockQuestionRepo.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(questions);
  });

  test('getAllQuestions returns 200 with options', async () => {
    req.query.includeOptions = 'true';

    const questions = [{ id: 1 }, { id: 2 }];
    const options = [
      { id: 101, question_id: 1 },
      { id: 102, question_id: 1 },
      { id: 103, question_id: 2 },
    ];

    mockQuestionRepo.findAll.mockResolvedValue(questions);
    mockOptionRepo.findAll.mockResolvedValue(options);

    await getAllQuestions(req, res);

    expect(mockOptionRepo.findAll).toHaveBeenCalled();
    expect(questions[0].options).toEqual([
      { id: 101, question_id: 1 },
      { id: 102, question_id: 1 },
    ]);
    expect(questions[1].options).toEqual([{ id: 103, question_id: 2 }]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(questions);
  });

  test('getAllQuestions returns 500 on error', async () => {
    mockQuestionRepo.findAll.mockRejectedValue(new Error('Error'));

    await getAllQuestions(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Could not fetch questions',
      detail: 'Error',
    });
  });

  test('getAllQuestionsByDichotomyId returns 200 with questions', async () => {
    req.params.id = '2';
    const results = [{ id: 1, dichotomy_id: 2 }];

    mockQuestionRepo.findAllByKey.mockResolvedValue(results);

    await getAllQuestionsByDichotomyId(req, res);

    expect(mockQuestionRepo.findAllByKey).toHaveBeenCalledWith('dichotomy_id', '2');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(results);
  });

  test('getAllQuestionsByDichotomyId returns 500 on failure', async () => {
    req.params.id = '2';
    mockQuestionRepo.findAllByKey.mockRejectedValue(new Error('Oops'));

    await getAllQuestionsByDichotomyId(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Could not fetch questions for dichotomy',
      detail: 'Oops',
    });
  });
});
