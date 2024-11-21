import prisma from '../../prisma/client.js';

export const getBookings = async (filters = {}) => {
  try {
    const whereClause = {};

    // Voeg filters toe op basis van queryparameters
    if (filters.userId) {
      whereClause.userId = filters.userId;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
    });

    // Map schema fields to API response fields
    return bookings.map((booking) => ({
      id: booking.id,
      userId: booking.userId,
      propertyId: booking.propertyId,
      checkinDate: booking.checkinDate, // Map to API field
      checkoutDate: booking.checkoutDate, // Map to API field
      numberOfGuests: booking.numberOfGuests,
      totalPrice: booking.totalPrice,
      bookingStatus: booking.bookingStatus,
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error.meta || error.message);
    throw error;
  }
};