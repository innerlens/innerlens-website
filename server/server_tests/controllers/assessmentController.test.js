import { jest } from '@jest/globals';

const mockAssessmentRepo = {
  findById: jest.fn(),
};

jest.unstable_mockModule('../../repositories/assessmentRepository.js', () => ({
  assessmentRepository: mockAssessmentRepo,
}));

jest.unstable_mockModule('../../utils/httpStatus.js', () => ({
  HTTP_STATUS: {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    CREATED: 201,
    CONFLICT: 409,
    FORBIDDEN: 403,
  },
}));

const { getAssessmentById } = await import('../../controllers/assessmentController.js');

describe('getAssessmentById', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '42' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockAssessmentRepo.findById.mockReset();
  });

  test('returns 200 with assessment if found', async () => {
    const fakeAssessment = { id: 42, user_id: 1 };
    mockAssessmentRepo.findById.mockResolvedValue(fakeAssessment);

    await getAssessmentById(req, res);

    expect(mockAssessmentRepo.findById).toHaveBeenCalledWith(42);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeAssessment);
  });

  test('returns 404 if assessment not found', async () => {
    mockAssessmentRepo.findById.mockResolvedValue(null);

    await getAssessmentById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Assessment not found' });
  });

  test('returns 500 on internal error', async () => {
    mockAssessmentRepo.findById.mockRejectedValue(new Error('DB error'));

    await getAssessmentById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Could not retrieve assessment',
      detail: 'DB error',
    });
  });
});
