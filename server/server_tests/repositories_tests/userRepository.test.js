import { jest } from '@jest/globals';

const mockQueryDb = jest.fn();

jest.unstable_mockModule('../../config/dbConfig.js', () => ({
  queryDb: mockQueryDb,
}));

const { userRepository } = await import('../../repositories/userRepository.js');

describe('userRepository', () => {
  beforeEach(() => {
    mockQueryDb.mockClear();
  });

  test('findById returns a user if found', async () => {
    const mockRow = { id: 1, name: 'Alice' };
    mockQueryDb.mockResolvedValue({ rows: [mockRow] });

    const result = await userRepository.findById(1);

    expect(mockQueryDb).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE id = $1 LIMIT 1',
      [1]
    );
    expect(result).toEqual(mockRow);
  });

  test('findAll returns all users', async () => {
    const mockRows = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    mockQueryDb.mockResolvedValue({ rows: mockRows });

    const result = await userRepository.findAll();

    expect(mockQueryDb).toHaveBeenCalledWith('SELECT * FROM users');
    expect(result).toEqual(mockRows);
  });
});
