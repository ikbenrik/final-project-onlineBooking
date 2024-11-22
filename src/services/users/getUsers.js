import prisma from '../../prisma/client.js';

export const getUsers = async (filter = {}) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        ...filter,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true
      },
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
