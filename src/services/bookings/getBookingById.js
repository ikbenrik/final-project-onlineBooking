import prisma from '../../prisma/client.js';

export const getBookingById = async (id) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) return null;

    // Map schema fields to API response fields
    return {
      id: booking.id,
      userId: booking.userId,
      propertyId: booking.propertyId,
      checkinDate: booking.checkinDate, // Map to API field
      checkoutDate: booking.checkoutDate, // Map to API field
      numberOfGuests: booking.numberOfGuests,
      totalPrice: booking.totalPrice,
      bookingStatus: booking.bookingStatus,
    };
  } catch (error) {
    console.error('Error fetching booking by ID:', error.meta || error.message);
    throw error;
  }
};
