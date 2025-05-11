import { jest } from '@jest/globals';

// Mock middleware and controller functions
const mockAuth = jest.fn((req, res, next) => next());
const mockValidateParams = jest.fn(() => (req, res, next) => next());
const mockValidateQuery = jest.fn(() => (req, res, next) => next());

const mockGetAll = jest.fn();
const mockGetById = jest.fn();
const mockGetByDichotomyId = jest.fn();

jest.unstable_mockModule('../../middleware/authMiddleware.js', () => ({
  authMiddleware: mockAuth,
}));
jest.unstable_mockModule('../../middleware/validateMiddleware.js', () => ({
  validateUrlParams: mockValidateParams,
  validateQueryParams: mockValidateQuery,
}));
jest.unstable_mockModule('../../controllers/questionController.js', () => ({
  getQuestionById: mockGetById,
  getAllQuestions: mockGetAll,
  getAllQuestionsByDichotomyId: mockGetByDichotomyId,
}));

const { questionRouter } = await import('../../routers/questionRouter.js');

describe('questionRouter', () => {
  test('uses authMiddleware globally', () => {
    const authLayer = questionRouter.stack.find(layer => !layer.route);
    expect(authLayer?.handle).toBe(mockAuth);
  });

  test('GET / is registered with getAllQuestions', () => {
    const route = questionRouter.stack.find(
      (layer) => layer.route?.path === '/' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBe(mockGetAll);
  });

  test('GET /:id is registered with validateUrlParams, validateQueryParams, and getQuestionById', () => {
    const route = questionRouter.stack.find(
      (layer) => layer.route?.path === '/:id' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBeInstanceOf(Function); // validateUrlParams
    expect(route.route.stack[1].handle).toBeInstanceOf(Function); // validateQueryParams
    expect(route.route.stack[2].handle).toBe(mockGetById);
  });

  test('GET /dichotomy/:id is registered with validateUrlParams and getAllQuestionsByDichotomyId', () => {
    const route = questionRouter.stack.find(
      (layer) => layer.route?.path === '/dichotomy/:id' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBeInstanceOf(Function);
    expect(route.route.stack[1].handle).toBe(mockGetByDichotomyId);
  });
});
