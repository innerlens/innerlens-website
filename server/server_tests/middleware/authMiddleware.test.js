import { jest } from '@jest/globals';

const mockVerifyGoogleJwt = jest.fn();

jest.unstable_mockModule('../../services/authService.js', () => ({
  verifyGoogleJwt: mockVerifyGoogleJwt,
}));
jest.unstable_mockModule('../../utils/httpStatus.js', () => ({
  HTTP_STATUS: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
  }
}));

const { authMiddleware } = await import('../../middleware/authMiddleware.js');

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    mockVerifyGoogleJwt.mockReset();
  });

  test('returns 401 if no Authorization header', async () => {
    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  test('attaches user and calls next if token is valid', async () => {
    req.headers.authorization = 'Bearer valid-token';
    const payload = { userId: 1, email: 'test@example.com' };

    mockVerifyGoogleJwt.mockResolvedValue(payload);

    await authMiddleware(req, res, next);

    expect(mockVerifyGoogleJwt).toHaveBeenCalledWith('valid-token');
    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
  });

  test('returns 403 if token is invalid', async () => {
    req.headers.authorization = 'Bearer invalid-token';
    mockVerifyGoogleJwt.mockRejectedValue(new Error('Token error'));

    await authMiddleware(req, res, next);

    expect(mockVerifyGoogleJwt).toHaveBeenCalledWith('invalid-token');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });
});
