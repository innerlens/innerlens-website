import { userRepository } from '../repositories/userRepository.js';

export async function getUserById(req, res) {
  const user = await userRepository.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

export async function createUser(req, res) {
    try {
      const { google_id, username, email } = req.body;
  
      if (!google_id || !username || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const existing = await userRepository.findById(google_id);
      if (existing) return res.status(409).json({ error: 'User already exists' });
  
      const user = await userRepository.create({ google_id, username, email });
      res.status(201).json(user);
    } catch (err) {
      console.error('Create user failed:', err.message);
      return res.status(400).json({ error: 'Invalid input', detail: err.message });
    }
  }  

  export async function updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email } = req.body;
  
      if (!username && !email) {
        return res.status(400).json({ error: 'At least one field (username or email) must be provided' });
      }
  
      const updated = await userRepository.update(id, req.body);
  
      if (!updated) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(updated);
    } catch (err) {
      console.error('Update user failed:', err.message);
      res.status(400).json({ error: 'Invalid input', detail: err.message });
    }
  }  

export async function deleteUser(req, res) {
  const { id } = req.params;
  const deleted = await userRepository.delete(id);
  if (!deleted) return res.status(404).json({ error: 'User not found' });
  res.status(204).send();
}

export async function getAllUsers(req, res) {
  const users = await userRepository.findAll();
  res.json(users);
}
