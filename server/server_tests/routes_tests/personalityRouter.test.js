import { jest } from '@jest/globals';

const mockAuth = jest.fn((req, res, next) => next());
const mockValidateParams = jest.fn(() => (req, res, next) => next());

const mockGetAll = jest.fn();
const mockGetById = jest.fn();
const mockGetByCode = jest.fn();

jest.unstable_mockModule('../../middleware/authMiddleware.js', () => ({
  authMiddleware: mockAuth,
}));
jest.unstable_mockModule('../../middleware/validateMiddleware.js', () => ({
  validateUrlParams: mockValidateParams,
}));
jest.unstable_mockModule('../../controllers/personalityController.js', () => ({
  getAllPersonalities: mockGetAll,
  getPersonalityById: mockGetById,
  getPersonalityByCode: mockGetByCode,
}));

const { personalityRouter } = await import('../../routers/personalityRouter.js');

describe('personalityRouter', () => {
  test('uses authMiddleware globally', () => {
    const globalMiddleware = personalityRouter.stack.find(layer => !layer.route);
    expect(globalMiddleware?.handle).toBe(mockAuth);
  });

  test('GET / route is registered with getAllPersonalities', () => {
    const route = personalityRouter.stack.find(
      (layer) => layer.route?.path === '/' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBe(mockGetAll);
  });

  test('GET /:id route is registered with validateUrlParams and getPersonalityById', () => {
    const route = personalityRouter.stack.find(
      (layer) => layer.route?.path === '/:id' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBeInstanceOf(Function);
    expect(route.route.stack[1].handle).toBe(mockGetById);
  });

  test('GET /code/:code route is registered with validateUrlParams and getPersonalityByCode', () => {
    const route = personalityRouter.stack.find(
      (layer) => layer.route?.path === '/code/:code' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBeInstanceOf(Function);
    expect(route.route.stack[1].handle).toBe(mockGetByCode);
  });
});
