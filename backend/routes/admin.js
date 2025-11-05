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

    // Total counts matching AdminStats interface
    const totalSubmissions = await News.countDocuments();
    const pendingReviews = await News.countDocuments({ status: 'pending' });
    const publishedArticles = await News.countDocuments({ status: 'approved' });
    const rejectedArticles = await News.countDocuments({ status: 'rejected' });

    // Total villages (unique villages from submissions)
    const totalVillages = await News.distinct('village').then(villages => villages.length);

    // Active reporters (users with submissions in last 30 days)
    const activeReporters = await User.countDocuments({
      lastSubmissionDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // Monthly statistics
    const monthlySubmissions = await News.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    const monthlyPublished = await News.countDocuments({
      status: 'approved',
      approvedAt: { $gte: startOfMonth }
    });
    const monthlyRejected = await News.countDocuments({
      status: 'rejected',
      rejectedAt: { $gte: startOfMonth }
    });
    const monthlyViews = await News.aggregate([
      { $match: { publishedAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$viewCount' } } }
    ]);
    const monthlyNewUsers = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Daily statistics for last 7 days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const daySubmissions = await News.countDocuments({
        createdAt: { $gte: startOfDay, $lt: endOfDay }
      });
      const dayPublished = await News.countDocuments({
        status: 'approved',
        approvedAt: { $gte: startOfDay, $lt: endOfDay }
      });
      const dayViews = await News.aggregate([
        { $match: { publishedAt: { $gte: startOfDay, $lt: endOfDay } } },
        { $group: { _id: null, total: { $sum: '$viewCount' } } }
      ]);
      const dayActiveUsers = await User.countDocuments({
        lastActive: { $gte: startOfDay, $lt: endOfDay }
      });

      dailyStats.push({
        date: startOfDay.toISOString().split('T')[0],
        submissions: daySubmissions,
        published: dayPublished,
        views: dayViews[0]?.total || 0,
        activeUsers: dayActiveUsers
      });
    }

    // Top villages with reporters count
    const topVillages = await News.aggregate([
      { $group: {
        _id: '$village',
        submissions: { $sum: 1 },
        published: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
        views: { $sum: '$viewCount' }
      }},
      { $sort: { submissions: -1 } },
      { $limit: 5 }
    ]);

    // Add reporters count for each village
    for (const village of topVillages) {
      village.reporters = await User.countDocuments({ village: village._id });
    }

    // Category breakdown with percentages and views
    const totalArticles = await News.countDocuments({ status: 'approved' });
    const categoryBreakdown = await News.aggregate([
      { $match: { status: 'approved' } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 },
        views: { $sum: '$viewCount' }
      }},
      { $sort: { count: -1 } }
    ]);

    // Calculate percentages
    categoryBreakdown.forEach(cat => {
      cat.percentage = totalArticles > 0 ? Math.round((cat.count / totalArticles) * 100) : 0;
    });

    res.json({
      totalSubmissions,
      pendingReviews,
      publishedArticles,
      rejectedArticles,
      totalVillages,
      activeReporters,
      monthlyStats: {
        month: `${startOfMonth.toLocaleString('default', { month: 'long' })} ${startOfMonth.getFullYear()}`,
        submissions: monthlySubmissions,
        published: monthlyPublished,
        rejected: monthlyRejected,
        views: monthlyViews[0]?.total || 0,
        newUsers: monthlyNewUsers
      },
      dailyStats,
      topVillages: topVillages.map(v => ({
        village: v._id,
        submissions: v.submissions,
        published: v.published,
        views: v.views,
        reporters: v.reporters
      })),
      categoryBreakdown: categoryBreakdown.map(c => ({
        category: c._id,
        count: c.count,
        percentage: c.percentage,
        views: c.views
      }))
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get all submissions (pending, approved, rejected)
router.get('/submissions', [
  query('status').optional().isIn(['pending', 'approved', 'rejected']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;

    const submissions = await News.find(filter)
      .populate('author', 'name email village phone')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await News.countDocuments(filter);

    // Transform submissions to include id field for frontend compatibility
    const transformedSubmissions = submissions.map(sub => ({
      id: sub._id.toString(),
      title: sub.title,
      content: sub.content,
      category: sub.category,
      village: sub.village,
      authorName: sub.authorName || (sub.author ? sub.author.name : 'Unknown'),
      authorPhone: sub.authorPhone || (sub.author ? sub.author.phone : ''),
      submittedAt: sub.createdAt,
      status: sub.status,
      location: sub.location,
      audioUrl: sub.audioUrl,
      imageUrl: sub.imageUrl,
      tags: sub.tags || [],
      adminNotes: sub.adminNotes,
      approvedBy: sub.approvedBy
    }));

    res.json({
      submissions: transformedSubmissions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: skip + submissions.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get all pending submissions (backward compatibility)
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
router.put('/approve/:id', async (req, res) => {
  try {
    const newsId = req.params.id;
    console.log('Approving news with ID:', newsId);

    const news = await News.findById(newsId);
    if (!news) {
      console.log('News not found for ID:', newsId);
      return res.status(404).json({ error: 'News article not found' });
    }

    if (news.status !== 'pending') {
      console.log('News status is not pending:', news.status);
      return res.status(400).json({ error: 'News is not pending approval' });
    }

    await news.approve(req.user._id);
    await news.publish();

    // Update user's approved submissions - handle both ObjectId and string authors
    if (typeof news.author === 'string') {
      // For predefined accounts, we don't update user stats
      console.log('Predefined account author, skipping user stats update');
    } else {
      await User.findByIdAndUpdate(news.author, {
        $inc: { approvedSubmissions: 1 },
        lastSubmissionDate: new Date()
      });

      // Check if user should be trusted now
      const user = await User.findById(news.author);
      if (user) {
        user.checkTrustStatus();
        await user.save();
      }
    }

    res.json({ message: 'News approved and published successfully' });
  } catch (error) {
    console.error('Approve news error:', error);
    res.status(500).json({ error: 'Failed to approve news' });
  }
});

// Reject news submission
router.put('/reject/:id', [
  body('reason').trim().isLength({ min: 10, max: 500 }).withMessage('Rejection reason required (10-500 characters)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reason } = req.body;
    const newsId = req.params.id;
    console.log('Rejecting news with ID:', newsId);

    const news = await News.findById(newsId);

    if (!news) {
      console.log('News not found for ID:', newsId);
      return res.status(404).json({ error: 'News article not found' });
    }

    if (news.status !== 'pending') {
      console.log('News status is not pending:', news.status);
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
