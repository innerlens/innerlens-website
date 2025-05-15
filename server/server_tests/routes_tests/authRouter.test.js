import { jest } from '@jest/globals';
import express from 'express';

const mockValidateRequestBody = jest.fn(() => (req, res, next) => next());
const mockGetGoogleJwt = jest.fn();

jest.unstable_mockModule('../../middleware/validateMiddleware.js', () => ({
  validateRequestBody: mockValidateRequestBody,
}));
jest.unstable_mockModule('../../controllers/authController.js', () => ({
  getGoogleJwt: mockGetGoogleJwt,
}));

const { authRouter } = await import('../../routers/authRouter.js');

describe('authRouter', () => {
  test('POST / is registered with validateRequestBody and getGoogleJwt', () => {
    const route = authRouter.stack.find(
      (layer) => layer.route?.path === '/' && layer.route.methods.post
    );

    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBeInstanceOf(Function);
    expect(route.route.stack[1].handle).toBe(mockGetGoogleJwt);
  });
});
