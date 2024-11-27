import express from 'express';
import { authenticateToken } from '../middleware/auth.js'; // Import middleware
import { getReviews } from '../services/reviews/getReviews.js';
import { getReviewById } from '../services/reviews/getReviewById.js';
import { createReview } from '../services/reviews/createReview.js';
import { updateReview } from '../services/reviews/updateReview.js';
import { deleteReview } from '../services/reviews/deleteReview.js';

const router = express.Router();

// GET /reviews - Fetch all reviews (Public Route)
router.get('/', async (req, res) => {
  const { userId, propertyId } = req.query; // Accept query parameters
  try {
    const reviews = await getReviews({ userId, propertyId }); // Pass filters to the service
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found' });
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error.message || error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /reviews/:id - Fetch a review by ID (Public Route)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Review ID is required' });
  }

  try {
    const review = await getReviewById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error.message || error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /reviews - Create a new review (Protected Route)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const newReview = await createReview(req.body);
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error.message || error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal Server Error' });
  }
});

// PUT /reviews/:id - Update a review by ID (Protected Route)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!id || Object.keys(updatedData).length === 0) {
    return res.status(400).json({ message: 'Invalid review ID or update data' });
  }

  try {
    const updatedReview = await updateReview(id, updatedData);
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error.message || error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /reviews/:id - Delete a review by ID (Protected Route)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Review ID is required' });
  }

  try {
    const isDeleted = await deleteReview(id);
    if (!isDeleted) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error("Error deleting review:", error.message || error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
