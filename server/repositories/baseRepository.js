import { queryDb } from '../config/dbConfig.js';

export class BaseRepository {
  constructor(tableName, primaryKey = 'id') {
    this.table = tableName;
    this.pk = primaryKey;
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.table} WHERE ${this.pk} = $1 LIMIT 1`;
    const result = await queryDb(query, [id]);
    return result.rows[0] || null;
  }

  async findByKey(columnName, value) {
    const query = `SELECT * FROM ${this.table} WHERE ${columnName} = $1 LIMIT 1`;
    const result = await queryDb(query, [value]);
    return result.rows[0] || null;
  }

  async findAll() {
    const query = `SELECT * FROM ${this.table}`;
    const result = await queryDb(query);
    return result.rows;
  }

  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, idx) => `$${idx + 1}`);

    const query = `
      INSERT INTO ${this.table} (${keys.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *`;

    const result = await queryDb(query, values);
    return result.rows[0];
  }

  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const updates = keys.map((key, idx) => `${key} = $${idx + 1}`);
    
    const query = `
      UPDATE ${this.table}
      SET ${updates.join(', ')}
      WHERE ${this.pk} = $${keys.length + 1}
      RETURNING *`;

    const result = await queryDb(query, [...values, id]);
    return result.rows[0];
  }

  async delete(id) {
    const query = `DELETE FROM ${this.table} WHERE ${this.pk} = $1 RETURNING *`;
    const result = await queryDb(query, [id]);
    return result.rows[0];
  }
}
