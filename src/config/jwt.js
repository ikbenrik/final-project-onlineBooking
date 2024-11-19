import jwt from 'jsonwebtoken';
import { getUsers } from '../users/getUsers.js';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateUser = (username, password) => {
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (user && user.password === password) {
    return jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  }
  return null;
};
