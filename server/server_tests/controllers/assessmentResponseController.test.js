import { jest } from '@jest/globals';

const mockAssessmentResponseRepo = {
  findById: jest.fn(),
  findAllByKey: jest.fn(),
  findResponseByAssessmentIdAndQuestionId: jest.fn(),
  create: jest.fn(),
};

const mockAssessmentRepo = { findById: jest.fn() };
const mockQuestionRepo = { findById: jest.fn() };
const mockOptionRepo = { findById: jest.fn() };

jest.unstable_mockModule('../../repositories/assessmentResponseRepository.js', () => ({
  assessmentResponseRepository: mockAssessmentResponseRepo,
}));
jest.unstable_mockModule('../../repositories/assessmentRepository.js', () => ({
  assessmentRepository: mockAssessmentRepo,
}));
jest.unstable_mockModule('../../repositories/questionRepository.js', () => ({
  questionRepository: mockQuestionRepo,
}));
jest.unstable_mockModule('../../repositories/questionOptionRepository.js', () => ({
  questionOptionRepository: mockOptionRepo,
}));
jest.unstable_mockModule('../../utils/httpStatus.js', () => ({
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },
}));

const {
  getAssessmentResponseById,
  getAllAssessmentResponsesByAssessmentyId,
  createAssessmentResponse,
} = await import('../../controllers/assessmentResponseController.js');

describe('assessmentResponseController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Object.values(mockAssessmentResponseRepo).forEach(fn => fn.mockReset());
    Object.values(mockAssessmentRepo).forEach(fn => fn.mockReset());
    Object.values(mockQuestionRepo).forEach(fn => fn.mockReset());
    Object.values(mockOptionRepo).forEach(fn => fn.mockReset());
  });

  test('getAssessmentResponseById returns 200 with response', async () => {
    req.params.id = '1';
    mockAssessmentResponseRepo.findById.mockResolvedValue({ id: 1 });

    await getAssessmentResponseById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });

  test('getAssessmentResponseById returns 404 when not found', async () => {
    req.params.id = '1';
    mockAssessmentResponseRepo.findById.mockResolvedValue(null);

    await getAssessmentResponseById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Assessment response not found' });
  });

  test('getAllAssessmentResponsesByAssessmentyId returns 200 with responses', async () => {
    req.params.id = '99';
    mockAssessmentResponseRepo.findAllByKey.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    await getAllAssessmentResponsesByAssessmentyId(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
  });

  test('createAssessmentResponse creates response and returns 201', async () => {
    req.body = { assessment_id: 1, question_id: 2, question_option_id: 3 };

    mockAssessmentRepo.findById.mockResolvedValue(true);
    mockQuestionRepo.findById.mockResolvedValue(true);
    mockOptionRepo.findById.mockResolvedValue({ trait_id: 4 });
    mockAssessmentResponseRepo.findResponseByAssessmentIdAndQuestionId.mockResolvedValue(null);
    mockAssessmentResponseRepo.create.mockResolvedValue({ id: 99 });

    await createAssessmentResponse(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 99 });
  });

  test('createAssessmentResponse returns 404 if assessment not found', async () => {
    req.body = { assessment_id: 1 };
    mockAssessmentRepo.findById.mockResolvedValue(null);

    await createAssessmentResponse(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Assessment does not exist' });
  });

  test('createAssessmentResponse returns 409 if response already exists', async () => {
    req.body = { assessment_id: 1, question_id: 2, question_option_id: 3 };

    mockAssessmentRepo.findById.mockResolvedValue(true);
    mockQuestionRepo.findById.mockResolvedValue(true);
    mockOptionRepo.findById.mockResolvedValue(true);
    mockAssessmentResponseRepo.findResponseByAssessmentIdAndQuestionId.mockResolvedValue({});

    await createAssessmentResponse(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: 'Assessment response already exists for question id' });
  });
});
