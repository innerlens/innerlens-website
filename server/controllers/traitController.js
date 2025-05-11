import { traitRepository } from '../repositories/traitRepository.js';
import { HTTP_STATUS } from '../utils/httpStatus.js';

export async function getAllTraits(req, res) {
    try {
      const trait = await traitRepository.findAll();
      res.status(HTTP_STATUS.OK).json(trait);

    } catch (error) {
      console.error('Error fetching traits:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve traits', detail: error.message });
    }
  }

export async function getTraitById(req, res) {
    try {
      const trait = await traitRepository.findById(parseInt(req.params.id));
      if (!trait) 
        return res.status(HTTP_STATUS.NOT_FOUND).json.json({ error: 'Trait not found' });
      res.status(HTTP_STATUS.OK).json(trait);

    } catch (error) {
      console.error('Error fetching trait:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve trait', detail: error.message });
    }
  }

export async function getTraitByCode(req, res) {
    try {
      const trait = await traitRepository.findByKey('code', req.params.code);
      if (!trait) 
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Trait not found' });
      res.status(HTTP_STATUS.OK).json(trait);

    } catch (error) {
      console.error('Error fetching trait by code:', error.message);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve trait', detail: error.message });
    }
  }