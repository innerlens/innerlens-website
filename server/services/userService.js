import { findUserById, createUser as repoCreateUser } from '../repositories/userRepository.js';

export async function createUser(id, name, email) {
  let user = await findUserById(id);
  if (user) {
    return user;
  } else {
    return await repoCreateUser(id, name, email);
  }
}

export async function getUserById(id) {
  return await findUserById(id);
}