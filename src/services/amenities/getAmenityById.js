import prisma from '../../prisma/client.js';

export const getAmenityById = async (amenityId) => {
  try {
    const amenity = await prisma.amenity.findUnique({ where: { id: amenityId } });

    if (!amenity) {
      throw new Error('Amenity not found');
    }

    return amenity;
  } catch (error) {
    console.error('Error fetching amenity by ID:', error);
    throw new Error('Failed to fetch amenity');
  }
};
