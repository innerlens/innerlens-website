import { BaseRepository } from './baseRepository.js';
import { queryDb } from '../config/dbConfig.js';

export const userRepository = new BaseRepository('users', 'id');

// Todo: Remove below later (here for reference in the meantime to extend later)
// userRepository.findUserByGoogleSub = async function(googleSub) {
//     const query = 'SELECT * FROM users WHERE google_sub = $1';
//     const result = await connectAndQuery(query, [googleSub]);
//     return result.rows[0] || null;
//   };