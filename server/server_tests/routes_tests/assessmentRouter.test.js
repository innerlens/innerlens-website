import { jest } from '@jest/globals';
import express from 'express';

// Mock all middleware and controller functions
const mockAuth = jest.fn((req, res, next) => next());
const mockValidateParams = jest.fn(() => (req, res, next) => next());
const mockValidateBody = jest.fn(() => (req, res, next) => next());

const mockGetById = jest.fn();
const mockCreate = jest.fn();
const mockPatch = jest.fn();
const mockGetByUser = jest.fn();
const mockGetResult = jest.fn();

jest.unstable_mockModule('../../middleware/authMiddleware.js', () => ({
  authMiddleware: mockAuth,
}));
jest.unstable_mockModule('../../middleware/validateMiddleware.js', () => ({
  validateUrlParams: mockValidateParams,
  validateRequestBody: mockValidateBody,
}));
jest.unstable_mockModule('../../controllers/assessmentController.js', () => ({
  getAssessmentById: mockGetById,
  createAssessment: mockCreate,
  completeAssessment: mockPatch,
  getAssessmentsByUserId: mockGetByUser,
  getAssessmentResult: mockGetResult,
}));

const { assessmentRouter } = await import('../../routers/assessmentRouter.js');

describe('assessmentRouter', () => {
  test('uses authMiddleware globally', () => {
    const globalMiddleware = assessmentRouter.stack.find(layer => !layer.route);
    expect(globalMiddleware?.handle).toBe(mockAuth);
  });

  test('GET /:id route is registered', () => {
    const route = assessmentRouter.stack.find(
      layer => layer.route?.path === '/:id' && layer.route.methods.get
    );
    expect(route.route.stack[0].handle).toBeInstanceOf(Function); // validateUrlParams
    expect(route.route.stack[1].handle).toBe(mockGetById);
  });

  test('GET /user/:id route is registered', () => {
    const route = assessmentRouter.stack.find(
      layer => layer.route?.path === '/user/:id' && layer.route.methods.get
    );
    expect(route.route.stack[0].handle).toBeInstanceOf(Function);
    expect(route.route.stack[1].handle).toBe(mockGetByUser);
  });

  test('GET /result/:id route is registered', () => {
    const route = assessmentRouter.stack.find(
      layer => layer.route?.path === '/result/:id' && layer.route.methods.get
    );
    expect(route.route.stack[0].handle).toBeInstanceOf(Function);
    expect(route.route.stack[1].handle).toBe(mockGetResult);
  });

  test('POST / route is registered', () => {
    const route = assessmentRouter.stack.find(
      layer => layer.route?.path === '/' && layer.route.methods.post
    );
    expect(route.route.stack[0].handle).toBeInstanceOf(Function); // validateRequestBody
    expect(route.route.stack[1].handle).toBe(mockCreate);
  });

  test('PATCH /:id route is registered', () => {
    const route = assessmentRouter.stack.find(
      layer => layer.route?.path === '/:id' && layer.route.methods.patch
    );
    expect(route.route.stack[0].handle).toBeInstanceOf(Function); // validateUrlParams
    expect(route.route.stack[1].handle).toBeInstanceOf(Function); // validateRequestBody
    expect(route.route.stack[2].handle).toBe(mockPatch);
  });
});
