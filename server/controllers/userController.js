import { userRepository } from '../repositories/userRepository.js';
import { HTTP_STATUS } from '../utils/httpStatus.js';

export async function getUserById(req, res) {
  try {
    const user = await userRepository.findById(parseInt(req.params.id));
    if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
    res.status(HTTP_STATUS.OK).json(user);

  } catch (err) {
    console.error('Get user failed:', err.message);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not retrieve user', detail: err.message });
  }
}

export async function getUserByGoogleId(req, res) {
  try {
    const user = await userRepository.findByKey('google_sub', req.params.id);
    if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
    res.status(HTTP_STATUS.OK).json(user);

  } catch (err) {
    console.error('Get user failed:', err.message);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not retrieve user', detail: err.message });
  }
}

export async function createUser(req, res) {
    try {
      const { google_sub, username, email } = req.body;

      if (await userRepository.findByKey('google_sub', google_sub)) {
        return res.status(HTTP_STATUS.CONFLICT).json({ error: 'User already exists' });
      }
      if (await userRepository.findByKey('email', email)) {
        return res.status(HTTP_STATUS.CONFLICT).json({ error: 'Email already taken' });
      }
  
      const user = await userRepository.create({ google_sub, username, email });
      res.status(HTTP_STATUS.CREATED).json(user);

    } catch (err) {
      console.error('Create user failed:', err.message);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not create user', detail: err.message });
    }
  }  

  export async function updateUser(req, res) {
    try {
      const { id } = req.params;

      const { username, email } = req.body;
      if (!username && !email) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'At least one field must be provided' });
      }

      if (await userRepository.findByKey('email', email)) {
        return res.status(HTTP_STATUS.CONFLICT).json({ error: 'Email already taken' });
      }

      const updatedUser = await userRepository.update(id, { username, email });  
      res.status(HTTP_STATUS.OK).json(updatedUser);

    } catch (err) {
      console.error('Update user failed:', err.message);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not update user', detail: err.message });
    }
  }  

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!await userRepository.findById(id)) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
    }

    const deleted = await userRepository.delete(id);
    res.status(HTTP_STATUS.NO_CONTENT).send();

  } catch (err) {
    console.error('Delete user failed:', err.message);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could not delete user', detail: err.message });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await userRepository.findAll();
    res.status(HTTP_STATUS.OK).json(users);

  } catch (err) {
    console.error('Get users failed:', err.message);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Could fetch users', detail: err.message });
  }
}
