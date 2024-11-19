import prisma from '../../prisma/client.js';

export const createUser = async (userData) => {
  try {
    const newUser = await prisma.user.create({
      data: userData,
    });
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
