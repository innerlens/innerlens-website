import { BaseRepository } from './baseRepository.js';

export const assessmentRepository = new BaseRepository('assessments', 'id');

assessmentRepository.findCurrentAssessmentByUserId = async function(userId) {
    const query = 'SELECT * FROM assessments WHERE user_id = $1 AND completed_at IS NULL';
    const result = await connectAndQuery(query, [userId]);
    return result.rows[0] || null;
  };