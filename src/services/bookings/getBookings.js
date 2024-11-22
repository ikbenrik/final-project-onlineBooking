import prisma from '../../prisma/client.js';

export const getBookings = async (filters) => {
    try {
        console.log('Constructed filters for query:', filters);

        // Validate filters
        if (!filters || Object.keys(filters).length === 0) {
            console.warn('No filters provided. Returning all bookings.');
        }

        // Perform the query
        const bookings = await prisma.booking.findMany({
            where: filters,
        });

        console.log('Database query executed. Result:', bookings);

        if (bookings.length === 0) {
            console.error('No bookings found. Filters used:', filters);
            throw new Error('No bookings found for the given filters.');
        }

        return bookings;
    } catch (error) {
        console.error('Error in getBookings service:', error.message || error);
        throw error;
    }
};