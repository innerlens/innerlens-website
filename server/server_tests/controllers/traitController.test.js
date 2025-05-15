import { jest } from '@jest/globals';

const mockTraitRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByKey: jest.fn(),
};

jest.unstable_mockModule('../../repositories/traitRepository.js', () => ({
  traitRepository: mockTraitRepo,
}));

jest.unstable_mockModule('../../utils/httpStatus.js', () => ({
  HTTP_STATUS: {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
}));

const {
  getAllTraits,
  getTraitById,
  getTraitByCode,
} = await import('../../controllers/traitController.js');

describe('traitController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Object.values(mockTraitRepo).forEach(fn => fn.mockReset());
  });

  // -------------------
  // getAllTraits
  // -------------------
  test('getAllTraits returns 200 with traits', async () => {
    const traits = [{ id: 1 }, { id: 2 }];
    mockTraitRepo.findAll.mockResolvedValue(traits);

    await getAllTraits(req, res);

    expect(mockTraitRepo.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(traits);
  });

  test('getAllTraits returns 500 on error', async () => {
    mockTraitRepo.findAll.mockRejectedValue(new Error('DB fail'));

    await getAllTraits(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to retrieve traits',
      detail: 'DB fail',
    });
  });

  test('getTraitById returns 200 with trait', async () => {
    req.params.id = '1';
    const trait = { id: 1, code: 'N' };
    mockTraitRepo.findById.mockResolvedValue(trait);

    await getTraitById(req, res);

    expect(mockTraitRepo.findById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(trait);
  });

  test('getTraitById returns 500 on error', async () => {
    req.params.id = '1';
    mockTraitRepo.findById.mockRejectedValue(new Error('Fail'));

    await getTraitById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to retrieve trait',
      detail: 'Fail',
    });
  });

  test('getTraitByCode returns 200 with trait', async () => {
    req.params.code = 'E';
    const trait = { id: 2, code: 'E' };
    mockTraitRepo.findByKey.mockResolvedValue(trait);

    await getTraitByCode(req, res);

    expect(mockTraitRepo.findByKey).toHaveBeenCalledWith('code', 'E');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(trait);
  });

  test('getTraitByCode returns 404 if not found', async () => {
    req.params.code = 'Z';
    mockTraitRepo.findByKey.mockResolvedValue(null);

    await getTraitByCode(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Trait not found' });
  });

  test('getTraitByCode returns 500 on error', async () => {
    req.params.code = 'X';
    mockTraitRepo.findByKey.mockRejectedValue(new Error('Crash'));

    await getTraitByCode(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to retrieve trait',
      detail: 'Crash',
    });
  });
});
