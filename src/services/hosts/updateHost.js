import prisma from '../../prisma/client.js';

export const updateHost = async (hostId, updatedData) => {
  try {
    // Check if the host exists
    const existingHost = await prisma.host.findUnique({
      where: { id: hostId },
    });

    if (!existingHost) {
      return null; // Return null if the host does not exist
    }

    // Update the host
    const updatedHost = await prisma.host.update({
      where: { id: hostId },
      data: updatedData,
    });

    return updatedHost;
  } catch (error) {
    console.error("Error updating host:", error);
    throw error; // Throw the error to be handled in the route
  }
};
