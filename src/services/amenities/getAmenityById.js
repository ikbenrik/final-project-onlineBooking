import prisma from '../../prisma/client.js';

export const getAmenityById = async (amenityId) => {
  try {
    const amenity = await prisma.amenity.findUnique({ where: { id: amenityId } });
    return amenity; // Return null if not found
  } catch (error) {
    console.error('Error fetching amenity by ID:', error.message || error);
    throw new Error('Failed to fetch amenity'); // Only throw for unexpected errors
  }
};
