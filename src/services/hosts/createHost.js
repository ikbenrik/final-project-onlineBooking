import prisma from '../../prisma/client.js';

export const createHost = async (hostData) => {
  try {
    // Validate required fields
    const { username, password, email } = hostData;
    if (!username || !password || !email) {
      throw new Error('Missing required fields: username, password, or email');
    }

    // Create the host
    const newHost = await prisma.host.create({
      data: hostData,
    });

    return newHost;
  } catch (error) {
    console.error("Error creating host:", error);

    // Handle specific Prisma errors
    if (error.code === 'P2002') { // Unique constraint violation
      throw new Error('Host with this username or email already exists');
    }

    throw error; // Re-throw for unhandled errors
  }
};
