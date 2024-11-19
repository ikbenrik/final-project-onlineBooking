import express from 'express';
import { getReviews } from '../services/reviews/getReviews.js';
import { getReviewById } from '../services/reviews/getReviewById.js';
import { createReview } from '../services/reviews/createReview.js';
import { updateReview } from '../services/reviews/updateReview.js';
import { deleteReview } from '../services/reviews/deleteReview.js';

const router = express.Router();

// GET /reviews - Fetch all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await getReviews();
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found' });
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error.message || error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /reviews/:id - Fetch a review by ID
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

// POST /reviews - Create a new review
router.post('/', async (req, res) => {
  try {
    const newReview = await createReview(req.body);
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error.message || error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Internal Server Error' });
  }
});


// PUT /reviews/:id - Update a review by ID
router.put('/:id', async (req, res) => {
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

// DELETE /reviews/:id - Delete a review by ID
router.delete('/:id', async (req, res) => {
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
