import express from 'express'; 
import { getHosts } from '../services/hosts/getHosts.js';
import { getHostById } from '../services/hosts/getHostById.js';
import { createHost } from '../services/hosts/createHost.js';
import { updateHost } from '../services/hosts/updateHost.js';
import { deleteHost } from '../services/hosts/deleteHost.js';
import { authenticateToken } from '../middleware/auth.js'; // Import the authentication middleware

const router = express.Router();

// GET /hosts - Fetch all hosts or filtered hosts
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.name) {
      filters.name = req.query.name;
    }

    const hosts = await getHosts(filters);

    if (hosts.length === 0) {
      return res.status(404).json({ message: 'No hosts found' });
    }

    res.status(200).json(hosts);
  } catch (error) {
    console.error('Error in GET /hosts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /hosts/:id - Fetch a host by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const host = await getHostById(id);
    if (host) {
      console.log("Host data fetched:", host); // Log the response
      res.status(200).json(host);
    } else {
      res.status(404).json({ message: 'Host not found' });
    }
  } catch (error) {
    console.error("Error in GET /hosts/:id:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /hosts - Create a new host
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Validate required fields
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password, and email are required' }); // Return 400 for missing fields
    }

    const newHost = await createHost(req.body);
    res.status(201).json(newHost); // Return 201 Created with the new host
  } catch (error) {
    console.error("Error creating host:", error);

    if (error.code === 'P2002') { // Prisma unique constraint violation
      return res.status(400).json({ message: 'Host with this username or email already exists' });
    }

    res.status(500).json({ message: 'Internal Server Error' }); // Catch-all for server errors
  }
});

// PUT /hosts/:id - Update a host by ID
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updatedHost = await updateHost(req.params.id, req.body);
    if (!updatedHost) {
      return res.status(404).json({ message: 'Host not found' }); // Return 404 if host does not exist
    }
    res.json(updatedHost);
  } catch (error) {
    console.error("Error updating host:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /hosts/:id - Delete a host by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const isDeleted = await deleteHost(req.params.id);
    if (!isDeleted) {
      return res.status(404).json({ message: 'Host not found' }); // Return 404 if host does not exist
    }
    res.status(200).json({ message: 'Host deleted successfully' });
  } catch (error) {
    console.error("Error deleting host:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
