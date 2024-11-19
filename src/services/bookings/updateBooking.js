import prisma from '../../prisma/client.js';

export const updateBooking = async (id, data) => {
  try {
      const { numberOfGuests, totalPrice, bookingStatus, checkinDate, checkoutDate } = data;

      const updatedBooking = await prisma.booking.update({
          where: { id },
          data: {
              numberOfGuests,
              totalPrice,
              bookingStatus,
              checkinDate: new Date(checkinDate),
              checkoutDate: new Date(checkoutDate),
          },
      });

      return updatedBooking;
  } catch (error) {
      console.error("Error updating booking:", error.message || error);
      throw error;
  }
};
