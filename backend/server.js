require('dotenv').config();
console.log("JWT_SECRET from env:", process.env.JWT_SECRET);
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');


const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to MongoDB (serverless-friendly with cached promise)
let cachedMongoPromise = null;
async function connectDB() {
  if (mongoose.connection.readyState === 1) return; // already connected
  if (cachedMongoPromise) {
    await cachedMongoPromise;
    return;
  }
  console.log('Connecting to MongoDB...');
  cachedMongoPromise = mongoose.connect(process.env.MONGODB_URI, {
    // Removed deprecated options
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  })
  .finally(() => {
    cachedMongoPromise = null;
  });
  await cachedMongoPromise;
}

// Ensure DB connection attempt happens per request in serverless envs
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {
    // Log and continue; specific routes may still work without DB
    console.error('DB connect middleware error:', e && e.message);
  } finally {
    next();
  }
});

// Export the Express app for Vercel
module.exports = app;

// Start server in local/dev environments
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 API server listening on http://localhost:${PORT}`);
  });
}
