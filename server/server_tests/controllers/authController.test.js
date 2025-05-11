import { jest } from '@jest/globals';

// Mocks
const mockVerifyGoogleJwt = jest.fn();
const mockUserRepo = {
  findByKey: jest.fn(),
  create: jest.fn(),
};

global.fetch = jest.fn();

jest.unstable_mockModule('../../services/authService.js', () => ({
  verifyGoogleJwt: mockVerifyGoogleJwt,
}));
jest.unstable_mockModule('../../repositories/userRepository.js', () => ({
  userRepository: mockUserRepo,
}));
jest.unstable_mockModule('../../utils/httpStatus.js', () => ({
  HTTP_STATUS: {
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
  },
}));

const { getGoogleJwt } = await import('../../controllers/authController.js');

describe('getGoogleJwt', () => {
  let req, res;

  beforeEach(() => {
    req = { body: { code: 'valid-code' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    fetch.mockReset();
    mockVerifyGoogleJwt.mockReset();
    mockUserRepo.findByKey.mockReset();
    mockUserRepo.create.mockReset();

    process.env.GOOGLE_CLIENT_ID = 'client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'client-secret';
    process.env.GOOGLE_REDIRECT_URI = 'http://localhost/callback';
  });

  test('returns 200 and jwt if code is valid', async () => {
    const fakeJwt = 'mock.jwt.token';
    const fakePayload = { sub: 'abc123', email: 'a@b.com', name: 'Test' };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id_token: fakeJwt }),
    });

    mockVerifyGoogleJwt.mockResolvedValue(fakePayload);
    mockUserRepo.findByKey.mockResolvedValue(null);
    mockUserRepo.create.mockResolvedValue({ id: 1 });

    await getGoogleJwt(req, res);

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://oauth2.googleapis.com/token'), expect.anything());
    expect(mockVerifyGoogleJwt).toHaveBeenCalledWith(fakeJwt);
    expect(mockUserRepo.create).toHaveBeenCalledWith({
      google_sub: 'abc123',
      username: 'Test',
      email: 'a@b.com',
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ jwt: fakeJwt });
  });

  test('returns 400 if fetch fails with bad code', async () => {
    fetch.mockResolvedValue({ ok: false });

    await getGoogleJwt(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid auth code' });
  });

  test('returns 500 if anything throws', async () => {
    fetch.mockRejectedValue(new Error('network down'));

    await getGoogleJwt(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining('Google OAuth failed') });
  });
});
