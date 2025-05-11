import { jest } from '@jest/globals';

const mockQueryDb = jest.fn();

// Mock queryDb before importing the repository
jest.unstable_mockModule('../../config/dbConfig.js', () => ({
  queryDb: mockQueryDb,
}));

const { dichotomyRepository } = await import('../../repositories/dichotomyRepository.js');

describe('dichotomyRepository', () => {
  beforeEach(() => {
    mockQueryDb.mockClear();
  });

  test('findById returns a dichotomy by ID', async () => {
    const mockRow = { id: 1, name: 'Introvert vs Extrovert' };
    mockQueryDb.mockResolvedValue({ rows: [mockRow] });

    const result = await dichotomyRepository.findById(1);

    expect(mockQueryDb).toHaveBeenCalledWith(
      'SELECT * FROM dichotomies WHERE id = $1 LIMIT 1',
      [1]
    );
    expect(result).toEqual(mockRow);
  });

  test('findAll returns all dichotomies', async () => {
    const mockRows = [
      { id: 1, name: 'Introvert vs Extrovert' },
      { id: 2, name: 'Thinking vs Feeling' },
    ];
    mockQueryDb.mockResolvedValue({ rows: mockRows });

    const result = await dichotomyRepository.findAll();

    expect(mockQueryDb).toHaveBeenCalledWith('SELECT * FROM dichotomies');
    expect(result).toEqual(mockRows);
  });
});
