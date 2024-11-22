import prisma from '../../prisma/client.js';

export const getProperties = async (filter = {}) => {
  try {
    

    const properties = await prisma.property.findMany({
      where: filter,
    });

    return properties;
  } catch (error) {
    console.error("Error fetching properties in getProperties.js:", error.message);
    throw error;
  }
};