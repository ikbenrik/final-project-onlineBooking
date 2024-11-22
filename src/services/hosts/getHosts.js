import prisma from '../../prisma/client.js';

export const getHosts = async (filters) => {
  try {
    // Constructing the filters dynamically
    const whereClause = {};
    if (filters.name) {
      whereClause.name = {
        contains: filters.name,
      };
    }

    // Add more filter conditions here if needed in the future

    const hosts = await prisma.host.findMany({
      where: whereClause,
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
    console.error('Error fetching hosts:', error);
    throw error;
  }
};
