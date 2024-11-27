import express from 'express';
import { authenticateUser } from '../services/login/authenticateUser.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await authenticateUser(username, password); // Controleer of deze functie goed werkt
    if (token) {
      res.status(200).json({ message: `Successfully logged in as ${username}`, token });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error("Error during login:", error); // Log de fout om details te krijgen
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
