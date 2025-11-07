const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-random';

// Predefined accounts for demo purposes
const PREDEFINED_ACCOUNTS = {
  'admin-001': {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '9876543210',
    village: 'Admin Village',
    role: 'admin',
    isTrusted: true,
    approvedSubmissions: 0,
    totalSubmissions: 0,
    totalViews: 0,
    monthlySubmissions: 0,
    isActive: true
  },
  'reporter-001': {
    id: 'reporter-001',
    name: 'Ram Singh',
    email: 'ram.singh@example.com',
    phone: '9876543211',
    village: 'Village A',
    role: 'reporter',
    isTrusted: true,
    approvedSubmissions: 25,
    totalSubmissions: 30,
    totalViews: 1500,
    monthlySubmissions: 8,
    isActive: true
  },
  'reporter-002': {
    id: 'reporter-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '9876543212',
    village: 'Village B',
    role: 'reporter',
    isTrusted: false,
    approvedSubmissions: 5,
    totalSubmissions: 8,
    totalViews: 300,
    monthlySubmissions: 2,
    isActive: true
  }
};

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('🔑 Decoded Token:', decoded);
    console.log('🧱 Available Predefined Accounts:', Object.keys(PREDEFINED_ACCOUNTS));

    // Check if it's a predefined account
    if (PREDEFINED_ACCOUNTS[decoded.userId]) {
      console.log('✅ Matched predefined account:', decoded.userId);
      req.user = PREDEFINED_ACCOUNTS[decoded.userId];
      return next();
    }


    // Check database user
    try {
      const user = await User.findById(decoded.userId).select('-password');

      if (!user || !user.isActive) {
        return res.status(401).json({ error: 'Invalid or inactive user' });
      }

      req.user = {
        ...user.toObject(),
        _id: user._id.toString()
      };
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({ error: 'Database connection failed' });
    }
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  console.log('👑 Checking role:', req.user?.role);

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Check if user is reporter or admin
const requireReporter = (req, res, next) => {
  if (!['admin', 'reporter'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Reporter or admin access required' });
  }
  next();
};

// Check if user is trusted reporter or admin
const requireTrusted = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.isTrusted) {
    return next();
  }
  return res.status(403).json({ 
    error: 'Trusted reporter access required',
    message: 'You need 20+ approved submissions to access this feature'
  });
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireReporter,
  requireTrusted,
  generateToken
};
