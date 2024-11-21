import prisma from '../../prisma/client.js';

export const getProperties = async (filters) => {
  try {
    const { location, pricePerNight } = filters;

    const whereClause = {};
    if (location) {
      whereClause.location = location;
    }
    if (pricePerNight) {
      whereClause.pricePerNight = parseFloat(pricePerNight);
    }

    const properties = await prisma.property.findMany({
      where: whereClause,
    });

    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};