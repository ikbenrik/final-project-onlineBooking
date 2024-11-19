import prisma from '../../prisma/client.js';

export const updateProperty = async (propertyId, updatedData) => {
  try {
    const existingProperty = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!existingProperty) {
      return null;
    }

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: updatedData,
    });
    return updatedProperty;
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};
