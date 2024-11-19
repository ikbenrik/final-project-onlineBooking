import prisma from '../../prisma/client.js';

export const getHostById = async (hostId) => {
  try {
    const host = await prisma.host.findUnique({
      where: { id: hostId },
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
    if (!host) {
      console.error(`Host with ID ${hostId} not found`);
    }
    return host;
  } catch (error) {
    console.error("Error fetching host by ID:", error);
    throw error;
  }
};
