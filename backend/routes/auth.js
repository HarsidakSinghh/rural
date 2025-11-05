const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Predefined accounts
const PREDEFINED_ACCOUNTS = {
  admin: {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '9876543210',
    village: 'Admin Village',
    password: 'admin123',
    role: 'admin',
    isTrusted: true,
    approvedSubmissions: 0
  },
  reporter1: {
    id: 'reporter-001',
    name: 'Ram Singh',
    email: 'ram.singh@example.com',
    phone: '9876543211',
    village: 'Village A',
    password: 'password123',
    role: 'reporter',
    isTrusted: true,
    approvedSubmissions: 25
  },
  reporter2: {
    id: 'reporter-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '9876543212',
    village: 'Village B',
    password: 'password123',
    role: 'reporter',
    isTrusted: false,
    approvedSubmissions: 5
  }
};

// Register new user
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number required'),
  body('village').trim().isLength({ min: 2, max: 100 }).withMessage('Village name required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, village, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      village,
      password,
      role: 'reporter'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        village: user.village,
        role: user.role,
        isTrusted: user.isTrusted,
        approvedSubmissions: user.approvedSubmissions
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check predefined accounts first
    const predefinedAccount = Object.values(PREDEFINED_ACCOUNTS).find(acc => acc.email === email);
    
    if (predefinedAccount) {
      if (predefinedAccount.password === password) {
        const token = generateToken(predefinedAccount.id);
        return res.json({
          message: 'Login successful',
          token,
          user: {
            id: predefinedAccount.id,
            name: predefinedAccount.name,
            email: predefinedAccount.email,
            phone: predefinedAccount.phone,
            village: predefinedAccount.village,
            role: predefinedAccount.role,
            isTrusted: predefinedAccount.isTrusted,
            approvedSubmissions: predefinedAccount.approvedSubmissions
          }
        });
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    // Check database users
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update monthly submissions
    user.updateMonthlySubmissions();
    user.checkTrustStatus();
    await user.save();

    const token = generateToken(user._id.toString());

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        village: user.village,
        role: user.role,
        isTrusted: user.isTrusted,
        approvedSubmissions: user.approvedSubmissions
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        village: req.user.village,
        role: req.user.role,
        isTrusted: req.user.isTrusted,
        approvedSubmissions: req.user.approvedSubmissions,
        totalSubmissions: req.user.totalSubmissions,
        totalViews: req.user.totalViews,
        monthlySubmissions: req.user.monthlySubmissions,
        profileImage: req.user.profileImage,
        bio: req.user.bio,
        socialLinks: req.user.socialLinks
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('phone').optional().isMobilePhone('en-IN'),
  body('village').optional().trim().isLength({ min: 2, max: 100 }),
  body('bio').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, village, bio, socialLinks } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (village) updateData.village = village;
    if (bio !== undefined) updateData.bio = bio;
    if (socialLinks) updateData.socialLinks = socialLinks;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        village: user.village,
        role: user.role,
        isTrusted: user.isTrusted,
        approvedSubmissions: user.approvedSubmissions,
        totalSubmissions: user.totalSubmissions,
        totalViews: user.totalViews,
        monthlySubmissions: user.monthlySubmissions,
        profileImage: user.profileImage,
        bio: user.bio,
        socialLinks: user.socialLinks
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
