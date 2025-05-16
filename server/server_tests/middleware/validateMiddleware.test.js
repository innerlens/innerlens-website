import { jest } from '@jest/globals';

jest.unstable_mockModule('../../utils/httpStatus.js', () => ({
  HTTP_STATUS: {
    BAD_REQUEST: 400,
  }
}));

const {
  validateRequestBody,
  validateUrlParams,
  validateQueryParams
} = await import('../../middleware/validateMiddleware.js');

describe('validateMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  const schema = {
    id: { type: 'integer', required: true },
    name: { type: 'string', required: false },
  };

  test('validateRequestBody passes with valid data', () => {
    req.body = { id: '123', name: 'test' };

    validateRequestBody(schema)(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('validateRequestBody fails on missing required field', () => {
    req.body = { name: 'test' };

    validateRequestBody(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'id is a required field' });
  });

  test('validateRequestBody fails on incorrect type', () => {
    req.body = { id: 'abc' };

    validateRequestBody(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'id field must be of type integer' });
  });

  test('validateUrlParams passes with valid data', () => {
    req.params = { id: '42' };

    validateUrlParams(schema)(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('validateQueryParams passes with valid optional fields', () => {
    req.query = { id: '123' };

    validateQueryParams(schema)(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('validateQueryParams fails with bad type', () => {
    req.query = { id: 'x' };

    validateQueryParams(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'id field must be of type integer' });
  });

  test('accepts empty optional fields without error', () => {
    req.body = { id: '12' };

    validateRequestBody(schema)(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
