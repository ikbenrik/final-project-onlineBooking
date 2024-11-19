import prisma from '../../prisma/client.js';

export const createBooking = async (data) => {
  try {
      const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = data;

      // Ensure required fields are present
      if (!userId || !propertyId || !checkinDate || !checkoutDate || !numberOfGuests || !totalPrice || !bookingStatus) {
          throw new Error("Missing required fields");
      }

      // Check if user and property exist
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error(`User with ID ${userId} does not exist`);

      const property = await prisma.property.findUnique({ where: { id: propertyId } });
      if (!property) throw new Error(`Property with ID ${propertyId} does not exist`);

      // Create booking
      const newBooking = await prisma.booking.create({
          data: {
              userId,
              propertyId,
              checkinDate: new Date(checkinDate),
              checkoutDate: new Date(checkoutDate),
              numberOfGuests,
              totalPrice,
              bookingStatus,
          },
      });

      return newBooking;
  } catch (error) {
      console.error("Error creating booking:", error.message || error);
      throw error;
  }
};