import { jest } from '@jest/globals';
import express from 'express';

// Mock all middleware and controllers
const mockAuth = jest.fn((req, res, next) => next());
const mockValidateParams = jest.fn(() => (req, res, next) => next());
const mockValidateBody = jest.fn(() => (req, res, next) => next());

const mockGetById = jest.fn();
const mockGetAllByAssessmentId = jest.fn();
const mockCreate = jest.fn();

// Replace actual implementations with mocks
jest.unstable_mockModule('../../middleware/authMiddleware.js', () => ({
  authMiddleware: mockAuth,
}));
jest.unstable_mockModule('../../middleware/validateMiddleware.js', () => ({
  validateUrlParams: mockValidateParams,
  validateRequestBody: mockValidateBody,
}));
jest.unstable_mockModule('../../controllers/assessmentResponseController.js', () => ({
  getAssessmentResponseById: mockGetById,
  getAllAssessmentResponsesByAssessmentyId: mockGetAllByAssessmentId,
  createAssessmentResponse: mockCreate,
}));

// Dynamically import router after mocks
const { responseRouter } = await import('../../routers/assessmentResponseRouter.js');

describe('responseRouter', () => {
  test('should define GET /:id route with correct handlers', () => {
    const stack = responseRouter.stack.find(
      (layer) => layer.route?.path === '/:id' && layer.route?.methods?.get
    );
    expect(stack.route.stack[0].handle).toBeInstanceOf(Function); // validateUrlParams
    expect(stack.route.stack[1].handle).toBe(mockGetById);
  });

  test('should define GET /assessment/:id route with correct handlers', () => {
    const stack = responseRouter.stack.find(
      (layer) => layer.route?.path === '/assessment/:id' && layer.route?.methods?.get
    );
    expect(stack.route.stack[0].handle).toBeInstanceOf(Function); // validateUrlParams
    expect(stack.route.stack[1].handle).toBe(mockGetAllByAssessmentId);
  });

  test('should define POST / route with correct handlers', () => {
    const stack = responseRouter.stack.find(
      (layer) => layer.route?.path === '/' && layer.route?.methods?.post
    );
    expect(stack.route.stack[0].handle).toBeInstanceOf(Function); // validateRequestBody
    expect(stack.route.stack[1].handle).toBe(mockCreate);
  });

  test('router uses authMiddleware globally', () => {
    const useLayer = responseRouter.stack.find(
      (layer) => !layer.route && layer.name === 'bound dispatch'
    );
    expect(useLayer).toBeUndefined(); // No `dispatch` middleware should exist outside a route

    // Instead, check the first non-route layer
    const authLayer = responseRouter.stack.find((layer) => !layer.route);
    expect(authLayer?.handle).toBe(mockAuth);
  });
});
