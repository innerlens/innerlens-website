import { jest } from '@jest/globals';

const mockQueryDb = jest.fn();

jest.unstable_mockModule('../../config/dbConfig.js', () => ({
  queryDb: mockQueryDb,
}));

const { BaseRepository } = await import('../../repositories/baseRepository.js');

describe('BaseRepository', () => {
  let repo;

  beforeEach(() => {
    mockQueryDb.mockClear();
    repo = new BaseRepository('users');
  });

  test('findById returns a record', async () => {
    mockQueryDb.mockResolvedValue({ rows: [{ id: 1, name: 'Alice' }] });
    const result = await repo.findById(1);
    expect(result).toEqual({ id: 1, name: 'Alice' });
  });

  test('findByKey returns a matching row', async () => {
    mockQueryDb.mockResolvedValue({ rows: [{ id: 2, email: 'test@example.com' }] });
    const result = await repo.findByKey('email', 'test@example.com');
    expect(result).toEqual({ id: 2, email: 'test@example.com' });
  });

  test('findAllByKey returns matching rows', async () => {
    const rows = [{ id: 1 }, { id: 2 }];
    mockQueryDb.mockResolvedValue({ rows });
    const result = await repo.findAllByKey('role', 'admin');
    expect(result).toEqual(rows);
  });

  test('findAll returns all rows', async () => {
    const rows = [{ id: 1 }, { id: 2 }];
    mockQueryDb.mockResolvedValue({ rows });
    const result = await repo.findAll();
    expect(result).toEqual(rows);
  });

  test('create inserts and returns new row', async () => {
    const data = { name: 'Bob', email: 'bob@example.com' };
    const inserted = { id: 3, ...data };
    mockQueryDb.mockResolvedValue({ rows: [inserted] });
    const result = await repo.create(data);
    expect(mockQueryDb).toHaveBeenCalled();
    expect(result).toEqual(inserted);
  });

  test('update modifies and returns updated row', async () => {
    const data = { name: 'Updated' };
    const updated = { id: 1, name: 'Updated' };
    mockQueryDb.mockResolvedValue({ rows: [updated] });
    const result = await repo.update(1, data);
    expect(result).toEqual(updated);
  });

  test('delete removes and returns deleted row', async () => {
    const deleted = { id: 1, name: 'Deleted' };
    mockQueryDb.mockResolvedValue({ rows: [deleted] });
    const result = await repo.delete(1);
    expect(result).toEqual(deleted);
  });
});
