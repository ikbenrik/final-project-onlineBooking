import prisma from '../../prisma/client.js';

export const updateAmenity = async (amenityId, updatedData) => {
  try {
    const existingAmenity = await prisma.amenity.findUnique({ where: { id: amenityId } });

    if (!existingAmenity) {
      throw new Error('Amenity not found');
    }

    const updatedAmenity = await prisma.amenity.update({
      where: { id: amenityId },
      data: updatedData,
    });
    return updatedAmenity;
  } catch (error) {
    console.error('Error updating amenity:', error.message || error);
    throw error;
  }
};