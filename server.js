// ============================================
// COMP229 - Job Portal Application Server
// Main server file implementing Express.js backend
// ============================================

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// ES6 modules don't have __dirname, so we create it manually
// This is needed for serving static files and path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// IMPORT ROUTES (MVC Pattern - Routes Layer)
// Each route file handles specific resource endpoints
// ============================================
import authRoutes from './backend/routes/authRoutes.js';        // Authentication & user management
import jobRoutes from './backend/routes/jobRoutes.js';          // Job posting CRUD operations
import userRoutes from './backend/routes/userRoutes.js';        // User profile operations
import applicationRoutes from './backend/routes/applicationRoutes.js'; // Job application management

// Load environment variables from .env file
// This keeps sensitive data (DB credentials, JWT secrets) out of code
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Default to 5000 if not specified in .env

// ============================================
// MIDDLEWARE CONFIGURATION
// Middleware functions execute in order for every request
// ============================================

// CORS (Cross-Origin Resource Sharing)
// Allows frontend (React on port 5173) to communicate with backend (Express on port 5000)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Whitelist frontend URL
  credentials: true // Allow cookies and authorization headers
}));

// Security headers via Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Basic rate limiting for all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', apiLimiter);

// Body Parser Middleware
// Parse incoming JSON payloads (req.body) for POST/PUT requests
app.use(express.json());

// Parse URL-encoded form data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Custom Request Logger Middleware
// Logs every incoming request for debugging purposes
// Helps track which endpoints are being called
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next(); // Pass control to next middleware
});

// Optional maintenance mode blocker (set MAINTENANCE_MODE=true in .env)
app.use((req, res, next) => {
  if (process.env.MAINTENANCE_MODE === 'true' && !req.originalUrl.startsWith('/api/health')) {
    return res.status(503).json({ message: 'Service temporarily unavailable - maintenance mode' });
  }
  next();
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// DATABASE CONNECTION FUNCTION
// Connects to MongoDB Atlas using Mongoose ODM
// ============================================
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using connection string from .env
    // Mongoose handles connection pooling and reconnection automatically
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log error and exit process
    // This prevents the app from running without a database
    console.error('Database connection error:', error);
    process.exit(1); // Exit with failure code
  }
};

// ============================================
// ROUTE MOUNTING (MVC Pattern - Routes Layer)
// Mount route handlers at specific base paths
// All routes are prefixed with /api for API versioning
// ============================================
app.use('/api/auth', authRoutes);           // Authentication endpoints: /api/auth/register, /api/auth/login
app.use('/api/jobs', jobRoutes);            // Job CRUD endpoints: /api/jobs, /api/jobs/:id
app.use('/api/users', userRoutes);          // User management: /api/users, /api/users/:id
app.use('/api/applications', applicationRoutes); // Application endpoints: /api/applications

// ============================================
// HEALTH CHECK ENDPOINT
// Simple endpoint to verify server is running
// Useful for monitoring and deployment verification
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Job Portal API is running!', 
    timestamp: new Date().toISOString() 
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// Must be defined AFTER all routes
// Catches any errors thrown in route handlers
// ============================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    // Hide detailed error messages in production for security
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message 
  });
});

// ============================================
// 404 NOT FOUND HANDLER
// Catches all undefined routes
// Must be the LAST route handler
// ============================================
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer().catch(console.error);

export default app;