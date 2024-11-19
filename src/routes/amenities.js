import express from 'express';
import { getAmenities } from '../services/amenities/getAmenities.js';
import { getAmenityById } from '../services/amenities/getAmenityById.js';
import { createAmenity } from '../services/amenities/createAmenity.js';
import { updateAmenity } from '../services/amenities/updateAmenity.js';
import { deleteAmenity } from '../services/amenities/deleteAmenity.js';

const router = express.Router();

// GET /amenities - Fetch all amenities
router.get('/', async (req, res) => {
  try {
    const amenities = await getAmenities();
    res.status(200).json(amenities);
  } catch (error) {
    console.error("Error fetching amenities:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /amenities/:id - Fetch an amenity by ID
router.get('/:id', async (req, res) => {
  try {
    const amenity = await getAmenityById(req.params.id);
    res.status(200).json(amenity);
  } catch (error) {
    console.error("Error fetching amenity:", error.message);
    res.status(404).json({ error: error.message });
  }
});

// POST /amenities - Create a new amenity
router.post('/', async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Amenity name is required' });
    }

    const newAmenity = await createAmenity(req.body);
    res.status(201).json(newAmenity);
  } catch (error) {
    console.error("Error creating amenity:", error.message || error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /amenities/:id - Update an amenity by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedAmenity = await updateAmenity(req.params.id, req.body);
    if (!updatedAmenity) {
      return res.status(404).json({ message: 'Amenity not found' });
    }
    res.status(200).json(updatedAmenity);
  } catch (error) {
    console.error("Error updating amenity:", error.message || error);
    res.status(error.message === 'Amenity not found' ? 404 : 500).json({ error: error.message });
  }
});

// DELETE /amenities/:id - Delete an amenity by ID
router.delete('/:id', async (req, res) => {
  try {
    const isDeleted = await deleteAmenity(req.params.id);
    res.status(isDeleted ? 200 : 404).json({ message: isDeleted ? 'Amenity deleted successfully' : 'Amenity not found' });
  } catch (error) {
    console.error("Error deleting amenity:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
