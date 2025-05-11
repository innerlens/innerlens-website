import { jest } from '@jest/globals';

// Mock middleware and controller functions
const mockAuth = jest.fn((req, res, next) => next());
const mockValidateParams = jest.fn(() => (req, res, next) => next());

const mockGetAll = jest.fn();
const mockGetById = jest.fn();
const mockGetByQuestionId = jest.fn();

jest.unstable_mockModule('../../middleware/authMiddleware.js', () => ({
  authMiddleware: mockAuth,
}));
jest.unstable_mockModule('../../middleware/validateMiddleware.js', () => ({
  validateUrlParams: mockValidateParams,
}));
jest.unstable_mockModule('../../controllers/questionOptionController.js', () => ({
  getAllQuestionOptions: mockGetAll,
  getQuestionOptionById: mockGetById,
  getAllQuestionOptionsByQuestionId: mockGetByQuestionId,
}));

const { questionOptionRouter } = await import('../../routers/questionOptionRouter.js');

describe('questionOptionRouter', () => {
  test('uses authMiddleware globally', () => {
    const authLayer = questionOptionRouter.stack.find(layer => !layer.route);
    expect(authLayer?.handle).toBe(mockAuth);
  });

  test('GET / route is registered with getAllQuestionOptions', () => {
    const route = questionOptionRouter.stack.find(
      (layer) => layer.route?.path === '/' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBe(mockGetAll);
  });

  test('GET /:id route is registered with validateUrlParams and getQuestionOptionById', () => {
    const route = questionOptionRouter.stack.find(
      (layer) => layer.route?.path === '/:id' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBeInstanceOf(Function);
    expect(route.route.stack[1].handle).toBe(mockGetById);
  });

  test('GET /question/:id route is registered with validateUrlParams and getAllQuestionOptionsByQuestionId', () => {
    const route = questionOptionRouter.stack.find(
      (layer) => layer.route?.path === '/question/:id' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBeInstanceOf(Function);
    expect(route.route.stack[1].handle).toBe(mockGetByQuestionId);
  });
});
