import { jest } from '@jest/globals';

const mockPersonalityRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByKey: jest.fn(),
};

jest.unstable_mockModule('../../repositories/personalityRepository.js', () => ({
  personalityRepository: mockPersonalityRepo,
}));

jest.unstable_mockModule('../../utils/httpStatus.js', () => ({
  HTTP_STATUS: {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
}));

const {
  getAllPersonalities,
  getPersonalityById,
  getPersonalityByCode,
} = await import('../../controllers/personalityController.js');

describe('personalityController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockPersonalityRepo.findAll.mockReset();
    mockPersonalityRepo.findById.mockReset();
    mockPersonalityRepo.findByKey.mockReset();
  });

  // -----------------------
  // getAllPersonalities
  // -----------------------
  test('getAllPersonalities returns 200 with results', async () => {
    const data = [{ id: 1 }, { id: 2 }];
    mockPersonalityRepo.findAll.mockResolvedValue(data);

    await getAllPersonalities(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(data);
  });

  test('getAllPersonalities returns 500 on error', async () => {
    mockPersonalityRepo.findAll.mockRejectedValue(new Error('DB fail'));

    await getAllPersonalities(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to retrieve personalities',
      detail: 'DB fail',
    });
  });

  // -----------------------
  // getPersonalityById
  // -----------------------
  test('getPersonalityById returns 200 with data', async () => {
    req.params.id = '1';
    const mockData = { id: 1, code: 'INTJ' };
    mockPersonalityRepo.findById.mockResolvedValue(mockData);

    await getPersonalityById(req, res);
    expect(mockPersonalityRepo.findById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('getPersonalityById returns 404 if not found', async () => {
    req.params.id = '1';
    mockPersonalityRepo.findById.mockResolvedValue(null);

    await getPersonalityById(req, res);
    console.log(res.json);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Personality not found' });
  });

  test('getPersonalityById returns 500 on error', async () => {
    req.params.id = '1';
    mockPersonalityRepo.findById.mockRejectedValue(new Error('DB error'));

    await getPersonalityById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to retrieve personality',
      detail: 'DB error',
    });
  });

  // -----------------------
  // getPersonalityByCode
  // -----------------------
  test('getPersonalityByCode returns 200 with result', async () => {
    req.params.code = 'ENFP';
    const mockData = { id: 2, code: 'ENFP' };
    mockPersonalityRepo.findByKey.mockResolvedValue(mockData);

    await getPersonalityByCode(req, res);
    expect(mockPersonalityRepo.findByKey).toHaveBeenCalledWith('code', 'ENFP');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('getPersonalityByCode returns 404 if not found', async () => {
    req.params.code = 'XYZ';
    mockPersonalityRepo.findByKey.mockResolvedValue(null);

    await getPersonalityByCode(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Personality not found' });
  });

  test('getPersonalityByCode returns 500 on error', async () => {
    req.params.code = 'INFJ';
    mockPersonalityRepo.findByKey.mockRejectedValue(new Error('DB crash'));

    await getPersonalityByCode(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to retrieve personality',
      detail: 'DB crash',
    });
  });
});
