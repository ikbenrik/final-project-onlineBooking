import prisma from '../../prisma/client.js';

export const deleteBooking = async (bookingId) => {
  try {
    const bookingExists = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!bookingExists) {
      return false; 
    }

    await prisma.booking.delete({
      where: { id: bookingId },
    });
    return true; 
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw new Error('Failed to delete booking');
  }
};
