import { jest } from '@jest/globals';

const mockUserRepo = {
  findById: jest.fn(),
  findByKey: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.unstable_mockModule('../../repositories/userRepository.js', () => ({
  userRepository: mockUserRepo,
}));

jest.unstable_mockModule('../../utils/httpStatus.js', () => ({
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    NOT_FOUND: 404,
    CONFLICT: 409,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
  },
}));

const {
  getUserById,
  getUserByGoogleId,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = await import('../../controllers/userController.js');

describe('userController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    Object.values(mockUserRepo).forEach(fn => fn.mockReset());
  });

  test('getUserById success', async () => {
    req.params.id = '1';
    mockUserRepo.findById.mockResolvedValue({ id: 1 });

    await getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('getUserById 404', async () => {
    req.params.id = '1';
    mockUserRepo.findById.mockResolvedValue(null);

    await getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('getUserByGoogleId success', async () => {
    req.params.id = 'abc123';
    mockUserRepo.findByKey.mockResolvedValue({ google_sub: 'abc123' });

    await getUserByGoogleId(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('getAllUsers success', async () => {
    mockUserRepo.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    await getAllUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('createUser success', async () => {
    req.body = { google_sub: 'g123', email: 'a@a.com', username: 'new' };
    mockUserRepo.findByKey.mockResolvedValueOnce(null); 
    mockUserRepo.findByKey.mockResolvedValueOnce(null); 
    mockUserRepo.create.mockResolvedValue({ id: 1 });

    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('createUser conflict (google_sub)', async () => {
    req.body = { google_sub: 'g123' };
    mockUserRepo.findByKey.mockResolvedValueOnce(true);

    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test('createUser conflict (email)', async () => {
    req.body = { google_sub: 'g123', email: 'a@a.com' };
    mockUserRepo.findByKey.mockResolvedValueOnce(null); 
    mockUserRepo.findByKey.mockResolvedValueOnce(true); 

    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test('updateUser success', async () => {
    req.params.id = '1';
    req.body = { email: 'new@email.com' };
    mockUserRepo.findByKey.mockResolvedValueOnce(null); 
    mockUserRepo.update.mockResolvedValue({ id: 1 });

    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('updateUser 400 if no fields', async () => {
    req.params.id = '1';
    req.body = {};

    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('updateUser conflict (email)', async () => {
    req.params.id = '1';
    req.body = { email: 'taken@email.com' };
    mockUserRepo.findByKey.mockResolvedValue(true);

    await updateUser(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test('deleteUser success', async () => {
    req.params.id = '1';
    mockUserRepo.findById.mockResolvedValue(true);
    mockUserRepo.delete.mockResolvedValue({});

    await deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test('deleteUser 404', async () => {
    req.params.id = '1';
    mockUserRepo.findById.mockResolvedValue(null);

    await deleteUser(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
