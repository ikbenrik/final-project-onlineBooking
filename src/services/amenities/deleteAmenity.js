import prisma from '../../prisma/client.js';

export const deleteAmenity = async (amenityId) => {
  try {
    const existingAmenity = await prisma.amenity.findUnique({ where: { id: amenityId } });

    if (!existingAmenity) {
      return false;
    }

    await prisma.amenity.delete({ where: { id: amenityId } });
    return true;
  } catch (error) {
    console.error('Error deleting amenity:', error);
    throw new Error('Failed to delete amenity');
  }
};
