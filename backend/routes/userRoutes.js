// ============================================
// USER ROUTES (MVC Pattern - Routes Layer)
// Defines HTTP endpoints for user management
// Base path: /api/users (mounted in server.js)
// ============================================

import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// ============================================
// GET ALL USERS
// @desc    Retrieve list of all active users (admin/employer functionality)
// @route   GET /api/users
// @access  Private (requires authentication)
// ============================================
router.get('/', authenticate, async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: { users }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
});

// ============================================
// GET SINGLE USER BY ID
// @desc    Retrieve detailed information about a specific user
// @route   GET /api/users/:id
// @access  Private (requires authentication)
// Useful for viewing other users' profiles (e.g., employer viewing job seeker profile)
// ============================================
router.get('/:id', authenticate, async (req, res) => {
  try {
    // Find user by ID, exclude password field for security
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error fetching user'
    });
  }
});

export default router;