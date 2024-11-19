import prisma from '../../prisma/client.js';

export const createAmenity = async (amenityData) => {
  try {
    if (!amenityData.name) {
      throw new Error('Amenity name is required');
    }

    const newAmenity = await prisma.amenity.create({
      data: amenityData,
    });
    return newAmenity;
  } catch (error) {
    console.error('Error creating amenity:', error.message || error);
    throw error;
  }
};
