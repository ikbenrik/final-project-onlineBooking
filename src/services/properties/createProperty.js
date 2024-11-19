import prisma from '../../prisma/client.js';

export const createProperty = async (propertyData) => {
  try {
    const requiredFields = ['title', 'location', 'pricePerNight', 'bedroomCount', 'bathRoomCount', 'maxGuestCount', 'hostId'];
    const missingFields = requiredFields.filter((field) => !propertyData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const newProperty = await prisma.property.create({ data: propertyData });
    return newProperty;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};
