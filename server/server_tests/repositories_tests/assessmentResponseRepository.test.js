import { jest } from '@jest/globals';

const mockQueryDb = jest.fn();

jest.unstable_mockModule('../../config/dbConfig.js', () => ({
  queryDb: mockQueryDb,
}));

const { assessmentResponseRepository } = await import(
  '../../repositories/assessmentResponseRepository.js'
);

describe('assessmentResponseRepository', () => {
  beforeEach(() => {
    mockQueryDb.mockClear();
  });

  test('findResponseByAssessmentIdAndQuestionId returns the response if found', async () => {
    const mockRow = {
      id: 1,
      assessment_id: 5,
      question_id: 10,
      answer: 'A',
    };
    mockQueryDb.mockResolvedValue({ rows: [mockRow] });

    const result = await assessmentResponseRepository.findResponseByAssessmentIdAndQuestionId(5, 10);

    expect(mockQueryDb).toHaveBeenCalledWith(
      'SELECT * FROM assessment_responses WHERE assessment_id = $1 AND question_id = $2',
      [5, 10]
    );
    expect(result).toEqual(mockRow);
  });

  test('findResponseByAssessmentIdAndQuestionId returns null if no response found', async () => {
    mockQueryDb.mockResolvedValue({ rows: [] });

    const result = await assessmentResponseRepository.findResponseByAssessmentIdAndQuestionId(5, 10);

    expect(result).toBeNull();
  });
});
