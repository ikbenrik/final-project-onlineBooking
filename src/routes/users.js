import express from 'express';
import { getUsers } from '../services/users/getUsers.js';
import { getUserById } from '../services/users/getUserById.js';
import { createUser } from '../services/users/createUser.js';
import { updateUser } from '../services/users/updateUser.js';
import { deleteUser } from '../services/users/deleteUser.js';

const router = express.Router();

// GET /users - Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await getUsers(); // Fetch all users
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' }); // Handle no users case
    }
    res.json(users.map(({ password, ...user }) => user)); // Exclude passwords from response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET /users/:id - Fetch a user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id); // Fetch user by ID
    if (user) {
      const { password, ...userWithoutPassword } = user; // Exclude password
      res.json(userWithoutPassword);
    } else {
      res.status(404).json({ message: 'User not found' }); // Handle user not found
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST /users - Create a new user
router.post('/', async (req, res) => {
  const { username, password, name, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, password, and email are required' });
  }
  try {
    const newUser = await createUser(req.body); // Create a new user
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.meta && error.meta.target) {
      res.status(400).json({ message: `Duplicate entry for ${error.meta.target}` });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// PUT /users/:id - Update a user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!id || Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'Invalid user ID or data' });
  }

  try {
    const updatedUser = await updateUser(id, data);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' }); // Handle not found case
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in PUT /users/:id route:', error.message || error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /users/:id - Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUser(id);
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Error in DELETE /users/:id:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
