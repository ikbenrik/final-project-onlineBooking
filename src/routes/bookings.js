import express from 'express';
import { getBookings } from '../services/bookings/getBookings.js';
import { getBookingById } from '../services/bookings/getBookingById.js';
import { createBooking } from '../services/bookings/createBooking.js';
import { updateBooking } from '../services/bookings/updateBooking.js';
import { deleteBooking } from '../services/bookings/deleteBooking.js';
import { authenticateToken } from '../middleware/auth.js'; // Import the middleware

const router = express.Router();

// Use authentication middleware for all routes
router.use(authenticateToken);

// GET /bookings - Fetch all bookings
router.get('/', async (req, res) => {
  try {
      const filters = {};

      // Extract filters from query parameters
      if (req.query.userId) {
          filters.userId = req.query.userId;
      }
      if (req.query.propertyId) {
          filters.propertyId = req.query.propertyId;
      }

      console.log('Received query parameters:', req.query);
      console.log('Constructed filters for query:', filters);

      // Fetch bookings based on filters
      const bookings = await getBookings(filters);

      return res.status(200).json(bookings);
  } catch (error) {
      console.error('Error in GET /bookings route:', error.message || error);

      if (error.message.includes('No bookings found')) {
          return res.status(404).json({ message: error.message });
      }

      // Handle unexpected errors
      return res.status(500).json({ message: 'Internal server error.' });
  }
});

// GET /bookings/:id - Fetch a booking by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Booking ID is required' });
  }

  try {
    const booking = await getBookingById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error in GET /bookings/:id route:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /bookings - Create a new booking
router.post('/', async (req, res) => {
  const data = req.body;

  // Validation for required fields
  const requiredFields = [
    'userId',
    'propertyId',
    'checkinDate',
    'checkoutDate',
    'numberOfGuests',
    'totalPrice',
    'bookingStatus',
  ];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  // Validate that dates are valid
  const checkinDate = new Date(data.checkinDate);
  const checkoutDate = new Date(data.checkoutDate);
  if (isNaN(checkinDate) || isNaN(checkoutDate)) {
    return res.status(400).json({ error: 'Invalid check-in or check-out date' });
  }

  // Validate that check-out is after check-in
  if (checkinDate >= checkoutDate) {
    return res.status(400).json({ error: 'Check-out date must be after check-in date' });
  }

  try {
    const newBooking = await createBooking(data);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error.message || error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /bookings/:id - Update a booking by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!id || Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'Invalid booking ID or data' });
  }

  try {
    const existingBooking = await getBookingById(id);
    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updatedBooking = await updateBooking(id, data);
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error in PUT /bookings/:id route:", error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /bookings/:id - Delete a booking by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const isDeleted = await deleteBooking(id);
    if (!isDeleted) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error("Error in DELETE /bookings/:id route:", error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

export default router;
