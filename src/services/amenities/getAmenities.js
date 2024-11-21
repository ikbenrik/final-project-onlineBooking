import prisma from '../../prisma/client.js';

export const getAmenities = async (filters = {}) => {
  try {
    // Dynamische filteropties opbouwen
    const whereClause = {};

    if (filters.name) {
      whereClause.name = { contains: filters.name, mode: 'insensitive' }; // Zoek op naam
    }

    const amenities = await prisma.amenity.findMany({
      where: whereClause,
    });

    if (!amenities || amenities.length === 0) {
      throw new Error('No amenities found');
    }

    return amenities;
  } catch (error) {
    console.error('Error fetching amenities:', error);
    throw new Error('Failed to fetch amenities');
  }
};