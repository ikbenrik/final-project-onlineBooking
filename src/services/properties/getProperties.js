import prisma from '../../prisma/client.js';

export const getProperties = async () => {
  try {
    const properties = await prisma.property.findMany();
    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};
