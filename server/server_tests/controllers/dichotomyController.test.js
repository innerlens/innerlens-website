import { jest } from '@jest/globals';

// Mock the repository and status constants
const mockDichotomyRepo = {
  findById: jest.fn(),
  findAll: jest.fn(),
};

jest.unstable_mockModule('../../repositories/dichotomyRepository.js', () => ({
  dichotomyRepository: mockDichotomyRepo,
}));

jest.unstable_mockModule('../../utils/httpStatus.js', () => ({
  HTTP_STATUS: {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
}));

const {
  getDichotomyById,
  getAllDichotomies,
} = await import('../../controllers/dichotomyController.js');

describe('dichotomyController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '1' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockDichotomyRepo.findById.mockReset();
    mockDichotomyRepo.findAll.mockReset();
  });

  // -------------------------------
  // getDichotomyById
  // -------------------------------
  test('getDichotomyById returns 200 with data if found', async () => {
    const mockDichotomy = { id: 1, left_trait_id: 1, right_trait_id: 2 };
    mockDichotomyRepo.findById.mockResolvedValue(mockDichotomy);

    await getDichotomyById(req, res);

    expect(mockDichotomyRepo.findById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockDichotomy);
  });

  test('getDichotomyById returns 404 if not found', async () => {
    mockDichotomyRepo.findById.mockResolvedValue(null);

    await getDichotomyById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Dichotomy not found' });
  });

  test('getDichotomyById returns 500 on error', async () => {
    mockDichotomyRepo.findById.mockRejectedValue(new Error('DB error'));

    await getDichotomyById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Could not retrieve dichotomy',
      detail: 'DB error',
    });
  });

  // -------------------------------
  // getAllDichotomies
  // -------------------------------
  test('getAllDichotomies returns 200 with data', async () => {
    const mockList = [{ id: 1 }, { id: 2 }];
    mockDichotomyRepo.findAll.mockResolvedValue(mockList);

    await getAllDichotomies(req, res);

    expect(mockDichotomyRepo.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockList);
  });

  test('getAllDichotomies returns 500 on failure', async () => {
    mockDichotomyRepo.findAll.mockRejectedValue(new Error('DB fail'));

    await getAllDichotomies(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Could not fetch dichotomies',
      detail: 'DB fail',
    });
  });
});
