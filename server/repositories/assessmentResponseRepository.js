import { BaseRepository } from './baseRepository.js';
import { queryDb } from '../config/dbConfig.js';

export const assessmentResponseRepository = new BaseRepository('assessment_responses', 'id');

assessmentResponseRepository.findResponseByAssessmentIdAndQuestionId = async function(assessmentId, questionId) {
    const query = 'SELECT * FROM assessment_responses WHERE assessment_id = $1 AND question_id = $2';
    const result = await queryDb(query, [assessmentId, questionId]);
    return result.rows[0] || null;
  };