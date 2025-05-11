import { jest } from '@jest/globals';

const mockQueryDb = jest.fn();

// Mock queryDb before importing the repository
jest.unstable_mockModule('../../config/dbConfig.js', () => ({
  queryDb: mockQueryDb,
}));

const { personalityRepository } = await import(
  '../../repositories/personalityRepository.js'
);

describe('personalityRepository', () => {
  beforeEach(() => {
    mockQueryDb.mockClear();
  });

  test('findById returns a personality if found', async () => {
    const mockRow = { id: 1, name: 'INTJ' };
    mockQueryDb.mockResolvedValue({ rows: [mockRow] });

    const result = await personalityRepository.findById(1);

    expect(mockQueryDb).toHaveBeenCalledWith(
      'SELECT * FROM personalities WHERE id = $1 LIMIT 1',
      [1]
    );
    expect(result).toEqual(mockRow);
  });

  test('findAll returns all personalities', async () => {
    const mockRows = [
      { id: 1, name: 'INTJ' },
      { id: 2, name: 'ENFP' },
    ];
    mockQueryDb.mockResolvedValue({ rows: mockRows });

    const result = await personalityRepository.findAll();

    expect(mockQueryDb).toHaveBeenCalledWith('SELECT * FROM personalities');
    expect(result).toEqual(mockRows);
  });
});
