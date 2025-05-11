import { jest } from '@jest/globals';

const mockQueryDb = jest.fn();

// Mock queryDb before importing the repository
jest.unstable_mockModule('../../config/dbConfig.js', () => ({
  queryDb: mockQueryDb,
}));

const { traitRepository } = await import(
  '../../repositories/traitRepository.js'
);

describe('traitRepository', () => {
  beforeEach(() => {
    mockQueryDb.mockClear();
  });

  test('findById returns a trait if found', async () => {
    const mockRow = { id: 1, name: 'Openness' };
    mockQueryDb.mockResolvedValue({ rows: [mockRow] });

    const result = await traitRepository.findById(1);

    expect(mockQueryDb).toHaveBeenCalledWith(
      'SELECT * FROM traits WHERE id = $1 LIMIT 1',
      [1]
    );
    expect(result).toEqual(mockRow);
  });

  test('findAll returns all traits', async () => {
    const mockRows = [
      { id: 1, name: 'Openness' },
      { id: 2, name: 'Conscientiousness' },
    ];
    mockQueryDb.mockResolvedValue({ rows: mockRows });

    const result = await traitRepository.findAll();

    expect(mockQueryDb).toHaveBeenCalledWith('SELECT * FROM traits');
    expect(result).toEqual(mockRows);
  });
});
