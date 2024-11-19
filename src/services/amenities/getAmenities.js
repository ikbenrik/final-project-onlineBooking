import prisma from '../../prisma/client.js';

export const getAmenities = async () => {
  try {
    const amenities = await prisma.amenity.findMany();
    if (!amenities || amenities.length === 0) {
      throw new Error('No amenities found');
    }
    return amenities;
  } catch (error) {
    console.error('Error fetching amenities:', error);
    throw new Error('Failed to fetch amenities');
  }
};
