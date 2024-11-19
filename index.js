// src/index.js

import express from 'express';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import dotenv from 'dotenv'; // For environment variables
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './src/middleware/errorHandling.js';

// Import routes
import loginRoutes from './src/routes/login.js';
import userRoutes from './src/routes/users.js';
import hostRoutes from './src/routes/hosts.js';
import propertyRoutes from './src/routes/properties.js';
import amenityRoutes from './src/routes/amenities.js';
import bookingRoutes from './src/routes/bookings.js';
import reviewRoutes from './src/routes/reviews.js';

// Environment setup
dotenv.config();

// Express setup
const app = express();
const PORT = process.env.PORT || 3000;

// Sentry setup (ensure DSN is defined in environment variables)
Sentry.init({ dsn: process.env.SENTRY_DSN });

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(morgan('combined')); // Logging
app.use(Sentry.Handlers.requestHandler()); // Sentry request handler

// Resolve __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global routes
app.use('/login', loginRoutes);
app.use('/users', userRoutes);
app.use('/hosts', hostRoutes);
app.use('/properties', propertyRoutes);
app.use('/amenities', amenityRoutes);
app.use('/bookings', bookingRoutes);
app.use('/reviews', reviewRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Server is working');
});

// Example error route to test Sentry error handling
app.get('/error', (req, res) => {
  throw new Error('Example error');
});

// Error handling middleware
app.use(Sentry.Handlers.errorHandler()); // Sentry error handler
app.use(errorHandler); // Custom error handler

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
