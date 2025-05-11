import { jest } from '@jest/globals';

// Mock middleware and controller handlers
const mockAuth = jest.fn((req, res, next) => next());
const mockValidateParams = jest.fn(() => (req, res, next) => next());

const mockGetUserById = jest.fn();
const mockGetUserByGoogleId = jest.fn();

jest.unstable_mockModule('../../middleware/authMiddleware.js', () => ({
  authMiddleware: mockAuth,
}));
jest.unstable_mockModule('../../middleware/validateMiddleware.js', () => ({
  validateUrlParams: mockValidateParams,
}));
jest.unstable_mockModule('../../controllers/userController.js', () => ({
  getUserById: mockGetUserById,
  getUserByGoogleId: mockGetUserByGoogleId,
}));

const { userRouter } = await import('../../routers/userRouter.js');

describe('userRouter', () => {
  test('uses authMiddleware globally', () => {
    const global = userRouter.stack.find(layer => !layer.route);
    expect(global?.handle).toBe(mockAuth);
  });

  test('GET /:id is registered with validateUrlParams and getUserById', () => {
    const route = userRouter.stack.find(
      (layer) => layer.route?.path === '/:id' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBeInstanceOf(Function); // validateUrlParams
    expect(route.route.stack[1].handle).toBe(mockGetUserById);
  });

  test('GET /google/:id is registered with validateUrlParams and getUserByGoogleId', () => {
    const route = userRouter.stack.find(
      (layer) => layer.route?.path === '/google/:id' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBeInstanceOf(Function); // validateUrlParams
    expect(route.route.stack[1].handle).toBe(mockGetUserByGoogleId);
  });
});
