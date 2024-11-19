import prisma from '../../prisma/client.js';

export const deleteProperty = async (propertyId) => {
  try {
    const existingProperty = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!existingProperty) {
        return false; // Property doesn't exist
    }

    await prisma.property.delete({ where: { id: propertyId } });
    return true;
} catch (error) {
    console.error("Error deleting property:", error.message || error);
    throw new Error("Internal server error while deleting property");
}
};
