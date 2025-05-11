import { jest } from '@jest/globals';

// Mock `jose` methods
const mockJwtVerify = jest.fn();
const mockCreateRemoteJWKSet = jest.fn(() => 'MOCK_JWKS');

jest.unstable_mockModule('jose', () => ({
  jwtVerify: mockJwtVerify,
  createRemoteJWKSet: mockCreateRemoteJWKSet,
}));

// Import after mocks
const { verifyGoogleJwt } = await import('../../services/authService.js');

describe('verifyGoogleJwt', () => {
  beforeEach(() => {
    mockJwtVerify.mockClear();
    process.env.GOOGLE_CLIENT_ID = 'test-client-id';
  });

  test('returns payload if token is valid', async () => {
    const fakePayload = { email: 'user@example.com', sub: '123' };

    mockJwtVerify.mockResolvedValue({ payload: fakePayload });

    const result = await verifyGoogleJwt('valid.jwt.token');

    expect(mockCreateRemoteJWKSet).toHaveBeenCalled();
    expect(mockJwtVerify).toHaveBeenCalledWith('valid.jwt.token', 'MOCK_JWKS', {
      issuer: 'https://accounts.google.com',
      audience: 'test-client-id',
    });
    expect(result).toEqual(fakePayload);
  });

  test('throws an error if jwtVerify fails', async () => {
    mockJwtVerify.mockRejectedValue(new Error('Signature error'));

    await expect(verifyGoogleJwt('invalid.jwt.token')).rejects.toThrow('Google token verification failed');
  });
});
