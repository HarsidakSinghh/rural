const express = require('express');
const { body, validationResult, query } = require('express-validator');
const News = require('../models/News');
const User = require('../models/User');
const Analytics = require('../models/Analytics');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Total counts
    const totalUsers = await User.countDocuments();
    const totalNews = await News.countDocuments();
    const totalViews = await News.aggregate([
      { $group: { _id: null, total: { $sum: '$viewCount' } } }
    ]);
    const totalSubmissions = await News.countDocuments();

    // Monthly statistics
    const monthlyUsers = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    const monthlyNews = await News.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    const monthlySubmissions = await News.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    const monthlyApprovals = await News.countDocuments({
      status: 'approved',
      approvedAt: { $gte: startOfMonth }
    });

    // Daily statistics
    const dailySubmissions = await News.countDocuments({
      createdAt: { $gte: startOfDay }
    });
    const dailyApprovals = await News.countDocuments({
      status: 'approved',
      approvedAt: { $gte: startOfDay }
    });
    const dailyViews = await News.aggregate([
      { $match: { publishedAt: { $gte: startOfDay } } },
      { $group: { _id: null, total: { $sum: '$viewCount' } } }
    ]);

    // Pending submissions
    const pendingSubmissions = await News.countDocuments({ status: 'pending' });
    const rejectedSubmissions = await News.countDocuments({ status: 'rejected' });

    // Category breakdown
    const categoryBreakdown = await News.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Top villages
    const topVillages = await News.aggregate([
      { $group: { 
        _id: '$village', 
        submissions: { $sum: 1 },
        views: { $sum: '$viewCount' }
      }},
      { $sort: { submissions: -1 } },
      { $limit: 10 }
    ]);

    // User statistics
    const trustedUsers = await User.countDocuments({ isTrusted: true });
    const activeUsers = await User.countDocuments({ 
      lastSubmissionDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // Approval rate
    const totalProcessed = await News.countDocuments({ 
      status: { $in: ['approved', 'rejected'] } 
    });
    const approvalRate = totalProcessed > 0 ? (monthlyApprovals / totalProcessed) * 100 : 0;

    res.json({
      overview: {
        totalUsers,
        totalNews,
        totalViews: totalViews[0]?.total || 0,
        totalSubmissions,
        pendingSubmissions,
        rejectedSubmissions
      },
      monthlyStats: {
        newUsers: monthlyUsers,
        newNews: monthlyNews,
        submissions: monthlySubmissions,
        approvals: monthlyApprovals,
        approvalRate: Math.round(approvalRate * 100) / 100
      },
      dailyStats: {
        submissions: dailySubmissions,
        approvals: dailyApprovals,
        views: dailyViews[0]?.total || 0
      },
      categoryBreakdown,
      topVillages,
      userStats: {
        totalUsers,
        trustedUsers,
        activeUsers
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get all pending submissions
router.get('/pending', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const submissions = await News.find({ status: 'pending' })
      .populate('author', 'name email village phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await News.countDocuments({ status: 'pending' });

    res.json({
      submissions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: skip + submissions.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get pending submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch pending submissions' });
  }
});

// Approve news submission
router.post('/approve/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'News article not found' });
    }

    if (news.status !== 'pending') {
      return res.status(400).json({ error: 'News is not pending approval' });
    }

    await news.approve(req.user._id);
    await news.publish();

    // Update user's approved submissions
    await User.findByIdAndUpdate(news.author, {
      $inc: { approvedSubmissions: 1 },
      lastSubmissionDate: new Date()
    });

    // Check if user should be trusted now
    const user = await User.findById(news.author);
    user.checkTrustStatus();
    await user.save();

    res.json({ message: 'News approved and published successfully' });
  } catch (error) {
    console.error('Approve news error:', error);
    res.status(500).json({ error: 'Failed to approve news' });
  }
});

// Reject news submission
router.post('/reject/:id', [
  body('reason').trim().isLength({ min: 10, max: 500 }).withMessage('Rejection reason required (10-500 characters)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reason } = req.body;
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ error: 'News article not found' });
    }

    if (news.status !== 'pending') {
      return res.status(400).json({ error: 'News is not pending approval' });
    }

    await news.reject(reason);

    res.json({ message: 'News rejected successfully' });
  } catch (error) {
    console.error('Reject news error:', error);
    res.status(500).json({ error: 'Failed to reject news' });
  }
});

// Get all users
router.get('/users', [
  query('role').optional().isIn(['admin', 'reporter', 'viewer']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: skip + users.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user status
router.put('/users/:id/status', [
  body('isActive').isBoolean().withMessage('isActive must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Get analytics data
router.get('/analytics', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get analytics for date range
    const analytics = await Analytics.getAnalyticsRange(start, end);

    // If no analytics data, generate from current data
    if (analytics.length === 0) {
      const totalUsers = await User.countDocuments();
      const totalNews = await News.countDocuments();
      const totalViews = await News.aggregate([
        { $group: { _id: null, total: { $sum: '$viewCount' } } }
      ]);
      const totalSubmissions = await News.countDocuments();

      res.json({
        period: { start, end },
        data: {
          totalUsers,
          totalNews,
          totalViews: totalViews[0]?.total || 0,
          totalSubmissions
        }
      });
    } else {
      res.json({
        period: { start, end },
        data: analytics
      });
    }
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
