import { jest } from '@jest/globals';

const mockQueryDb = jest.fn();

// Mock queryDb before importing the module using it
jest.unstable_mockModule('../../config/dbConfig.js', () => ({
  queryDb: mockQueryDb,
}));

// Dynamically import the repository after mocking
const { assessmentRepository } = await import('../../repositories/assessmentRepository.js');

describe('assessmentRepository', () => {
  beforeEach(() => {
    mockQueryDb.mockClear();
  });

  test('findCurrentAssessmentByUserId returns the current assessment if exists', async () => {
    const mockRow = { id: 1, user_id: 42, completed_at: null };
    mockQueryDb.mockResolvedValue({ rows: [mockRow] });

    const result = await assessmentRepository.findCurrentAssessmentByUserId(42);

    expect(mockQueryDb).toHaveBeenCalledWith(
      'SELECT * FROM assessments WHERE user_id = $1 AND completed_at IS NULL',
      [42]
    );
    expect(result).toEqual(mockRow);
  });

  test('findCurrentAssessmentByUserId returns null if no match found', async () => {
    mockQueryDb.mockResolvedValue({ rows: [] });

    const result = await assessmentRepository.findCurrentAssessmentByUserId(99);

    expect(result).toBeNull();
  });
});
