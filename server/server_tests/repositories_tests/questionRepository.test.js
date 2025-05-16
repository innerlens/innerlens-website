import { jest } from '@jest/globals';

const mockQueryDb = jest.fn();

jest.unstable_mockModule('../../config/dbConfig.js', () => ({
  queryDb: mockQueryDb,
}));

const { questionRepository } = await import(
  '../../repositories/questionRepository.js'
);

describe('questionRepository', () => {
  beforeEach(() => {
    mockQueryDb.mockClear();
  });

  test('findById returns a question if found', async () => {
    const mockRow = { id: 1, text: 'Do you enjoy working alone?' };
    mockQueryDb.mockResolvedValue({ rows: [mockRow] });

    const result = await questionRepository.findById(1);

    expect(mockQueryDb).toHaveBeenCalledWith(
      'SELECT * FROM questions WHERE id = $1 LIMIT 1',
      [1]
    );
    expect(result).toEqual(mockRow);
  });

  test('findAll returns all questions', async () => {
    const mockRows = [
      { id: 1, text: 'Do you enjoy working alone?' },
      { id: 2, text: 'Do you prefer facts over ideas?' },
    ];
    mockQueryDb.mockResolvedValue({ rows: mockRows });

    const result = await questionRepository.findAll();

    expect(mockQueryDb).toHaveBeenCalledWith('SELECT * FROM questions');
    expect(result).toEqual(mockRows);
  });
});
