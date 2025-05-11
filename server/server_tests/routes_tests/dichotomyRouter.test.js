import { jest } from '@jest/globals';

// Mock middleware and controllers
const mockAuth = jest.fn((req, res, next) => next());
const mockValidateParams = jest.fn(() => (req, res, next) => next());
const mockGetAll = jest.fn();
const mockGetById = jest.fn();

jest.unstable_mockModule('../../middleware/authMiddleware.js', () => ({
  authMiddleware: mockAuth,
}));
jest.unstable_mockModule('../../middleware/validateMiddleware.js', () => ({
  validateUrlParams: mockValidateParams,
}));
jest.unstable_mockModule('../../controllers/dichotomyController.js', () => ({
  getAllDichotomies: mockGetAll,
  getDichotomyById: mockGetById,
}));

const { dichotomyRouter } = await import('../../routers/dichotomyRouter.js');

describe('dichotomyRouter', () => {
  test('uses authMiddleware globally', () => {
    const authLayer = dichotomyRouter.stack.find(layer => !layer.route);
    expect(authLayer?.handle).toBe(mockAuth);
  });

  test('GET / route is registered with getAllDichotomies', () => {
    const route = dichotomyRouter.stack.find(
      (layer) => layer.route?.path === '/' && layer.route.methods.get
    );

    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBe(mockGetAll);
  });

  test('GET /:id route is registered with validateUrlParams and getDichotomyById', () => {
    const route = dichotomyRouter.stack.find(
      (layer) => layer.route?.path === '/:id' && layer.route.methods.get
    );

    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBeInstanceOf(Function); // validateUrlParams
    expect(route.route.stack[1].handle).toBe(mockGetById);
  });
});
