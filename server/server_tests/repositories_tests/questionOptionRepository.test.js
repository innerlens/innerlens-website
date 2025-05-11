import { jest } from '@jest/globals';

const mockQueryDb = jest.fn();

// Mock queryDb before importing the repository
jest.unstable_mockModule('../../config/dbConfig.js', () => ({
  queryDb: mockQueryDb,
}));

const { questionOptionRepository } = await import(
  '../../repositories/questionOptionRepository.js'
);

describe('questionOptionRepository', () => {
  beforeEach(() => {
    mockQueryDb.mockClear();
  });

  test('findById returns a question option if found', async () => {
    const mockRow = { id: 1, text: 'Agree' };
    mockQueryDb.mockResolvedValue({ rows: [mockRow] });

    const result = await questionOptionRepository.findById(1);

    expect(mockQueryDb).toHaveBeenCalledWith(
      'SELECT * FROM question_options WHERE id = $1 LIMIT 1',
      [1]
    );
    expect(result).toEqual(mockRow);
  });

  test('findAll returns all question options', async () => {
    const mockRows = [
      { id: 1, text: 'Agree' },
      { id: 2, text: 'Disagree' },
    ];
    mockQueryDb.mockResolvedValue({ rows: mockRows });

    const result = await questionOptionRepository.findAll();

    expect(mockQueryDb).toHaveBeenCalledWith('SELECT * FROM question_options');
    expect(result).toEqual(mockRows);
  });
});
