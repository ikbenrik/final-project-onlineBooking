import prisma from '../../prisma/client.js';

export const getPropertyById = async (propertyId) => {
  try {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });

    if (!property) {
      return null; // Return null if the property is not found
    }

    return property;
  } catch (error) {
    console.error("Error fetching property by ID:", error);
    throw error;
  }
};