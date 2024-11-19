import jwt from 'jsonwebtoken';
import prisma from '../../prisma/client.js';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET:", JWT_SECRET); // Controleer of JWT_SECRET een waarde heeft

export const authenticateUser = async (username, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user && user.password === password) {
      return jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    }
    return null;
  } catch (error) {
    console.error("Error in authenticateUser:", error);
    throw error;
  }
};
