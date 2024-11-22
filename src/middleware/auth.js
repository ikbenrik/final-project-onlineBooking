import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate token
export const authenticateToken = (req, res, next) => {
  // List of public routes that don't require authentication
  const publicRoutes = [
    { method: 'GET', path: /^\/users\/[^\/]*$/ }, // GET /users/:id
    { method: 'GET', path: /^\/users$/ },        // GET /users
    { method: 'GET', path: /^\/hosts\/[^\/]*$/ }, // GET /hosts/:id
    { method: 'GET', path: /^\/hosts$/ },        // GET /hosts
    { method: 'GET', path: /^\/properties\/[^\/]*$/ }, // GET /properties/:id
    { method: 'GET', path: /^\/properties$/ },        // GET /properties
    { method: 'GET', path: /^\/amenities\/[^\/]*$/ }, // GET /amenities/:id
    { method: 'GET', path: /^\/amenities$/ },        // GET /amenities
    { method: 'GET', path: /^\/reviews\/[^\/]*$/ },  // GET /reviews/:id
    { method: 'GET', path: /^\/reviews$/ },          // GET /reviews
  ];

  // Check if the route matches a public route
  const isPublicRoute = publicRoutes.some(
    (route) =>
      route.method === req.method && route.path.test(req.path)
  );

  if (isPublicRoute) {
    // Skip authentication for public routes
    return next();
  }

  // Require token for all non-public routes
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Allow the route handler to determine the response status
    req.isAuthenticated = false; // Add a flag to indicate lack of authentication
    return next();
  }

  try {
    // Verify the token
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user; // Attach the decoded user to the request
    req.isAuthenticated = true; // Indicate successful authentication
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    req.isAuthenticated = false; // Mark as not authenticated
    next(); // Proceed to the route handler
  }
};