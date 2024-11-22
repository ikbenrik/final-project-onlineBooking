import prisma from './prisma/client.js'; // Adjust the path if needed

const runQueries = async () => {
    try {
        console.log('Fetching all bookings...');
        const allBookings = await prisma.booking.findMany();
        console.log('All Bookings:', allBookings);

        console.log('\nRunning raw SQL query...');
        const rawResult = await prisma.$queryRaw`SELECT * FROM "Booking"`;
        console.log('Raw Query Result:', rawResult);
    } catch (error) {
        console.error('Error running queries:', error.message || error);
    } finally {
        await prisma.$disconnect(); // Ensure the Prisma client disconnects
    }
};

runQueries();
