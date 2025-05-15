import { jest } from '@jest/globals';

const mockQuestionOptionRepo = {
  findById: jest.fn(),
  findAll: jest.fn(),
  findAllByKey: jest.fn(),
};

jest.unstable_mockModule('../../repositories/questionOptionRepository.js', () => ({
  questionOptionRepository: mockQuestionOptionRepo,
}));

jest.unstable_mockModule('../../utils/httpStatus.js', () => ({
  HTTP_STATUS: {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
}));

const {
  getQuestionOptionById,
  getAllQuestionOptions,
  getAllQuestionOptionsByQuestionId,
} = await import('../../controllers/questionOptionController.js');

describe('questionOptionController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Object.values(mockQuestionOptionRepo).forEach(fn => fn.mockReset());
  });

  test('getQuestionOptionById returns 200 with result', async () => {
    req.params.id = '1';
    const option = { id: 1, text: 'Agree' };
    mockQuestionOptionRepo.findById.mockResolvedValue(option);

    await getQuestionOptionById(req, res);
    expect(mockQuestionOptionRepo.findById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(option);
  });

  test('getQuestionOptionById returns 404 if not found', async () => {
    req.params.id = '1';
    mockQuestionOptionRepo.findById.mockResolvedValue(null);

    await getQuestionOptionById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Question option not found' });
  });

  test('getQuestionOptionById returns 500 on error', async () => {
    req.params.id = '1';
    mockQuestionOptionRepo.findById.mockRejectedValue(new Error('DB error'));

    await getQuestionOptionById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Could not retrieve question option',
      detail: 'DB error',
    });
  });

  test('getAllQuestionOptions returns 200 with list', async () => {
    const options = [{ id: 1 }, { id: 2 }];
    mockQuestionOptionRepo.findAll.mockResolvedValue(options);

    await getAllQuestionOptions(req, res);
    expect(mockQuestionOptionRepo.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(options);
  });

  test('getAllQuestionOptions returns 500 on error', async () => {
    mockQuestionOptionRepo.findAll.mockRejectedValue(new Error('DB fail'));

    await getAllQuestionOptions(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Could not fetch question options',
      detail: 'DB fail',
    });
  });

  test('getAllQuestionOptionsByQuestionId returns 200 with options', async () => {
    req.params.id = '42';
    const options = [{ id: 1, question_id: 42 }];
    mockQuestionOptionRepo.findAllByKey.mockResolvedValue(options);

    await getAllQuestionOptionsByQuestionId(req, res);
    expect(mockQuestionOptionRepo.findAllByKey).toHaveBeenCalledWith('question_id', '42');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(options);
  });

  test('getAllQuestionOptionsByQuestionId returns 500 on error', async () => {
    req.params.id = '42';
    mockQuestionOptionRepo.findAllByKey.mockRejectedValue(new Error('DB exploded'));

    await getAllQuestionOptionsByQuestionId(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Could not fetch question options',
      detail: 'DB exploded',
    });
  });
});
