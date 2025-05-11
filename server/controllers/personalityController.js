import { personalityRepository } from '../repositories/personalityRepository.js';
import { HTTP_STATUS } from '../utils/httpStatus.js';

export async function getAllPersonalities(req, res) {
    try {
      const personalities = await personalityRepository.findAll();
      res.status(HTTP_STATUS.OK).json(personalities);

    } catch (error) {
      console.error('Error fetching personalities:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve personalities', detail: error.message });
    }
  }

export async function getPersonalityById(req, res) {
    try {
      const personality = await personalityRepository.findById(parseInt(req.params.id));
      if (!personality) 
        return res.status(HTTP_STATUS.NOT_FOUND).json.json({ error: 'Personality not found' });
      res.status(HTTP_STATUS.OK).json(personality);

    } catch (error) {
      console.error('Error fetching personality:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve personality', detail: error.message });
    }
  }

export async function getPersonalityByCode(req, res) {
    try {
      const personality = await personalityRepository.findByKey('code', req.params.code);
      if (!personality) 
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Personality not found' });
      res.status(HTTP_STATUS.OK).json(personality);

    } catch (error) {
      console.error('Error fetching personality by code:', error.message);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve personality', detail: error.message });
    }
  }