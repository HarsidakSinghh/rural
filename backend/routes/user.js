const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const News = require('../models/News');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get user's news statistics
    const totalSubmissions = await News.countDocuments({ author: userId });
    const approvedSubmissions = await News.countDocuments({ 
      author: userId, 
      status: 'approved' 
    });
    const pendingSubmissions = await News.countDocuments({ 
      author: userId, 
      status: 'pending' 
    });
    const rejectedSubmissions = await News.countDocuments({ 
      author: userId, 
      status: 'rejected' 
    });

    // Monthly submissions
    const monthlySubmissions = await News.countDocuments({
      author: userId,
      createdAt: { $gte: startOfMonth }
    });

    // Total views across all user's news
    const totalViews = await News.aggregate([
      { $match: { author: userId } },
      { $group: { _id: null, total: { $sum: '$viewCount' } } }
    ]);

    // Category breakdown for user's news
    const categoryBreakdown = await News.aggregate([
      { $match: { author: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent submissions
    const recentSubmissions = await News.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt viewCount');

    // Trust status
    const isTrusted = req.user.isTrusted;
    const submissionsNeeded = isTrusted ? 0 : Math.max(0, 20 - approvedSubmissions);

    res.json({
      stats: {
        totalSubmissions,
        approvedSubmissions,
        pendingSubmissions,
        rejectedSubmissions,
        monthlySubmissions,
        totalViews: totalViews[0]?.total || 0,
        isTrusted,
        submissionsNeeded
      },
      categoryBreakdown,
      recentSubmissions
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// Get user's profile with detailed stats
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    // Get additional stats
    const totalSubmissions = await News.countDocuments({ author: req.user._id });
    const approvedSubmissions = await News.countDocuments({ 
      author: req.user._id, 
      status: 'approved' 
    });
    const totalViews = await News.aggregate([
      { $match: { author: req.user._id } },
      { $group: { _id: null, total: { $sum: '$viewCount' } } }
    ]);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        village: user.village,
        role: user.role,
        isTrusted: user.isTrusted,
        approvedSubmissions: user.approvedSubmissions,
        totalSubmissions,
        totalViews: totalViews[0]?.total || 0,
        monthlySubmissions: user.monthlySubmissions,
        profileImage: user.profileImage,
        bio: user.bio,
        socialLinks: user.socialLinks,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('phone').optional().isMobilePhone('en-IN'),
  body('village').optional().trim().isLength({ min: 2, max: 100 }),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('socialLinks').optional().isObject()
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
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user's news submissions
router.get('/submissions', authenticateToken, [
  query('status').optional().isIn(['pending', 'approved', 'rejected', 'published']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { author: req.user._id };
    if (status) filter.status = status;

    const submissions = await News.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await News.countDocuments(filter);

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
    console.error('Get user submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get user's performance metrics
router.get('/performance', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Recent activity
    const recentSubmissions = await News.countDocuments({
      author: userId,
      createdAt: { $gte: last30Days }
    });

    // Approval rate
    const totalProcessed = await News.countDocuments({
      author: userId,
      status: { $in: ['approved', 'rejected'] }
    });
    const approvedCount = await News.countDocuments({
      author: userId,
      status: 'approved'
    });
    const approvalRate = totalProcessed > 0 ? (approvedCount / totalProcessed) * 100 : 0;

    // Average views per article
    const avgViews = await News.aggregate([
      { $match: { author: userId, status: 'published' } },
      { $group: { _id: null, avgViews: { $avg: '$viewCount' } } }
    ]);

    // Top performing articles
    const topArticles = await News.find({ author: userId, status: 'published' })
      .sort({ viewCount: -1 })
      .limit(5)
      .select('title viewCount likeCount shareCount publishedAt');

    // Monthly trend
    const monthlyTrend = await News.aggregate([
      { $match: { author: userId, createdAt: { $gte: last30Days } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      performance: {
        recentSubmissions,
        approvalRate: Math.round(approvalRate * 100) / 100,
        avgViews: Math.round((avgViews[0]?.avgViews || 0) * 100) / 100,
        totalArticles: await News.countDocuments({ author: userId })
      },
      topArticles,
      monthlyTrend
    });
  } catch (error) {
    console.error('Get user performance error:', error);
    res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
});

module.exports = router;
