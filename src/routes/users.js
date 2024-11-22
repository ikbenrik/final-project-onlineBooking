import express from 'express';
import { getUsers } from '../services/users/getUsers.js';
import { getUserById } from '../services/users/getUserById.js';
import { createUser } from '../services/users/createUser.js';
import { updateUser } from '../services/users/updateUser.js';
import { deleteUser } from '../services/users/deleteUser.js';
import { authenticateToken } from '../middleware/auth.js'; // Import the correct middleware

const router = express.Router();

// GET /users - Fetch all users with optional filters
router.get('/', async (req, res) => {
  try {
    const filters = {};

    if (req.query.username) {
      // Using 'equals' to handle case-insensitivity
      filters.username = req.query.username;
    }

    if (req.query.email) {
      filters.email = req.query.email;
    }

    const users = await getUsers(filters);

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    const sanitizedUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json(sanitizedUsers);
  } catch (error) {
    console.error('Error in GET /users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /users/:id - Fetch a user by ID (protected route)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /users - Create a new user (open route)
router.post('/', async (req, res) => {
  const { username, password, name, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, password, and email are required' });
  }
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT /users/:id - Update a user by ID (protected route)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!id || Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'Invalid user ID or data' });
  }

  try {
    const updatedUser = await updateUser(id, data);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error.message || error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /users/:id - Delete a user by ID (protected route)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUser(id);
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
