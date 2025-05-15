import { jest } from '@jest/globals';

// Mock middleware and controller handlers
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
jest.unstable_mockModule('../../controllers/traitController.js', () => ({
  getAllTraits: mockGetAll,
  getTraitById: mockGetById,
  getTraitByCode: mockGetByCode,
}));

const { traitRouter } = await import('../../routers/traitRouter.js');

describe('traitRouter', () => {
  test('uses authMiddleware globally', () => {
    const globalLayer = traitRouter.stack.find(layer => !layer.route);
    expect(globalLayer?.handle).toBe(mockAuth);
  });

  test('GET / route is registered with getAllTraits', () => {
    const route = traitRouter.stack.find(
      (layer) => layer.route?.path === '/' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBe(mockGetAll);
  });

  test('GET /:id is registered with validateUrlParams and getTraitById', () => {
    const route = traitRouter.stack.find(
      (layer) => layer.route?.path === '/:id' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBeInstanceOf(Function);
    expect(route.route.stack[1].handle).toBe(mockGetById);
  });

  test('GET /code/:code is registered with validateUrlParams and getTraitByCode', () => {
    const route = traitRouter.stack.find(
      (layer) => layer.route?.path === '/code/:code' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBeInstanceOf(Function);
    expect(route.route.stack[1].handle).toBe(mockGetByCode);
  });
});
