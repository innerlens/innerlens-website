import { dichotomyRepository } from "../repositories/dichotomyRepository.js";
import { HTTP_STATUS } from '../utils/httpStatus.js';

export async function getDichotomyById(req, res) {
  try {
    const dichotomy = await dichotomyRepository.findById(parseInt(req.params.id));
    if (!dichotomy) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Dichotomy not found' });
    res.status(HTTP_STATUS.OK).json(dichotomy);

  } catch (err) {
    console.error('Get question failed:', err.message);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not retrieve dichotomy', detail: err.message });
  }
}

export async function getAllDichotomies(req, res) {
  try {
    const dichotomies = await dichotomyRepository.findAll();
    res.status(HTTP_STATUS.OK).json(dichotomies);

  } catch (err) {
    console.error('Get questions failed:', err.message);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not fetch dichotomies', detail: err.message });
  }
}