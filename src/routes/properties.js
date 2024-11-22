import express from 'express';
import { getProperties } from '../services/properties/getProperties.js';
import { getPropertyById } from '../services/properties/getPropertyById.js';
import { createProperty } from '../services/properties/createProperty.js';
import { updateProperty } from '../services/properties/updateProperty.js';
import { deleteProperty } from '../services/properties/deleteProperty.js';
import { authenticateToken } from '../middleware/auth.js'; // Middleware for authentication

const router = express.Router();

// GET /properties - Fetch all properties with optional filters
router.get('/', async (req, res) => {
  try {
    const filters = {};

    // Apply filters for location
    if (req.query.location) {
      filters.location = {
        contains: req.query.location, // Removed mode: 'insensitive'
      };
    }

    // Apply filters for pricePerNight
    if (req.query.pricePerNight) {
      const price = parseFloat(req.query.pricePerNight);
      if (!isNaN(price)) {
        filters.pricePerNight = price;
      } else {
        return res.status(400).json({ message: "Invalid pricePerNight value" });
      }
    }

    // Combine filters using AND
    const combinedFilters = {
      AND: Object.entries(filters).map(([key, value]) => ({
        [key]: value,
      })),
    };

    

    const properties = await getProperties(combinedFilters);

    if (!properties.length) {
      return res.status(404).json({ message: "No properties found matching the criteria" });
    }

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error in GET /properties route:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET /properties/:id - Fetch a property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property); // Ensure `property` includes a valid `id`
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /properties - Create a new property
router.post('/', authenticateToken, async (req, res) => {
  const requiredFields = ['title', 'location', 'pricePerNight', 'bedroomCount', 'bathRoomCount', 'maxGuestCount', 'hostId'];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(', ')}`,
    });
  }

  try {
    const newProperty = await createProperty(req.body);
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error.message || error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /properties/:id - Update a property by ID
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: 'Update data is required' });
  }

  try {
    const updatedProperty = await updateProperty(id, req.body);
    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error.message || error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /properties/:id - Delete a property by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const isDeleted = await deleteProperty(id);
    res.status(isDeleted ? 200 : 404).json({
      message: isDeleted ? 'Property deleted successfully' : 'Property not found',
    });
  } catch (error) {
    console.error('Error deleting property:', error.message || error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
