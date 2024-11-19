import prisma from '../../prisma/client.js';

export const deleteHost = async (hostId) => {
  try {
    // Check if the host exists
    const existingHost = await prisma.host.findUnique({ where: { id: hostId } });
    if (!existingHost) {
      return false; // Return false if the host does not exist
    }

    // Delete related records and the host
    await prisma.property.deleteMany({ where: { hostId } });
    await prisma.host.delete({ where: { id: hostId } });
    return true;
  } catch (error) {
    console.error("Error deleting host:", error);
    throw error;
  }
};