import prisma from '../../prisma/client.js';

export const getHosts = async (filters) => {
  try {
    const query = {};
    if (filters && filters.name) {
      query.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    const hosts = await prisma.host.findMany({
      where: query,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        aboutMe: true,
        address: true,
      },
    });
    return hosts;
  } catch (error) {
    console.error("Error fetching hosts from database:", error);
    throw error; // Ensure the error is logged and thrown for route handling
  }
};
