import express from 'express';
import { getAmenities } from '../services/amenities/getAmenities.js';
import { getAmenityById } from '../services/amenities/getAmenityById.js';
import { createAmenity } from '../services/amenities/createAmenity.js';
import { updateAmenity } from '../services/amenities/updateAmenity.js';
import { deleteAmenity } from '../services/amenities/deleteAmenity.js';
import { authenticateToken } from '../middleware/auth.js'; // Import the middleware

const router = express.Router();

// GET /amenities - Fetch all amenities (No auth required)
router.get('/', async (req, res) => {
  try {
    const amenities = await getAmenities();
    res.status(200).json(amenities);
  } catch (error) {
    console.error("Error fetching amenities:", error.message);
    res.status(500).json({ error: 'Failed to fetch amenities' });
  }
});

// GET /amenities/:id - Fetch an amenity by ID (No auth required)
router.get('/:id', async (req, res) => {
  try {
    const amenity = await getAmenityById(req.params.id);
    if (!amenity) {
      return res.status(404).json({ error: 'Amenity not found' });
    }
    res.status(200).json(amenity);
  } catch (error) {
    console.error("Error fetching amenity:", error.message || error);
    res.status(500).json({ error: 'Failed to fetch amenity' });
  }
});

// POST /amenities - Create a new amenity (Requires auth)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Amenity name is required' });
    }

    const newAmenity = await createAmenity(req.body);
    res.status(201).json(newAmenity);
  } catch (error) {
    console.error("Error creating amenity:", error.message || error);
    res.status(500).json({ error: 'Failed to create amenity' });
  }
});

// PUT /amenities/:id - Update an amenity by ID (Requires auth)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updatedAmenity = await updateAmenity(req.params.id, req.body);
    if (!updatedAmenity) {
      return res.status(404).json({ error: 'Amenity not found' });
    }
    res.status(200).json(updatedAmenity);
  } catch (error) {
    console.error("Error updating amenity:", error.message || error);
    res.status(error.message === 'Amenity not found' ? 404 : 500).json({ error: 'Failed to update amenity' });
  }
});

// DELETE /amenities/:id - Delete an amenity by ID (Requires auth)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const isDeleted = await deleteAmenity(req.params.id);
    res.status(isDeleted ? 200 : 404).json({ message: isDeleted ? 'Amenity deleted successfully' : 'Amenity not found' });
  } catch (error) {
    console.error("Error deleting amenity:", error.message);
    res.status(500).json({ error: 'Failed to delete amenity' });
  }
});

export default router;
