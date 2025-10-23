const express = require('express');
const { body, validationResult, query } = require('express-validator');
const News = require('../models/News');
const User = require('../models/User');
const { authenticateToken, requireReporter, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all published news with filters
router.get('/', [
  query('category').optional().isIn(['agriculture', 'education', 'health', 'infrastructure', 'scheme', 'event', 'other']),
  query('village').optional().trim(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const { category, village, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { status: 'published' };
    if (category) filter.category = category;
    if (village) filter.village = new RegExp(village, 'i');

    const news = await News.find(filter)
      .populate('author', 'name email village')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await News.countDocuments(filter);

    res.json({
      news,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: skip + news.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get single news article
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('author', 'name email village')
      .populate('approvedBy', 'name');

    if (!news) {
      return res.status(404).json({ error: 'News article not found' });
    }

    // Increment view count
    await news.incrementViewCount();

    res.json({ news });
  } catch (error) {
    console.error('Get news detail error:', error);
    res.status(500).json({ error: 'Failed to fetch news article' });
  }
});

// Submit new news article
router.post('/', authenticateToken, requireReporter, [
  body('title').trim().isLength({ min: 10, max: 200 }).withMessage('Title must be 10-200 characters'),
  body('content').trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('category').isIn(['agriculture', 'education', 'health', 'infrastructure', 'scheme', 'event', 'other']).withMessage('Invalid category'),
  body('village').trim().isLength({ min: 2, max: 100 }).withMessage('Village name required'),
  body('location.latitude').isFloat().withMessage('Valid latitude required'),
  body('location.longitude').isFloat().withMessage('Valid longitude required'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      content,
      category,
      village,
      location,
      tags = [],
      images = [],
      videos = [],
      priority = 'medium',
      isBreaking = false
    } = req.body;

    const news = new News({
      title,
      content,
      category,
      village,
      author: req.user._id,
      authorName: req.user.name,
      location,
      isGeoTagged: !!location,
      tags,
      images,
      videos,
      priority,
      isBreaking,
      status: 'pending'
    });

    await news.save();

    // Update user's total submissions
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalSubmissions: 1 },
      lastSubmissionDate: new Date()
    });

    res.status(201).json({
      message: 'News submitted successfully',
      news: {
        id: news._id,
        title: news.title,
        status: news.status,
        submittedAt: news.createdAt
      }
    });
  } catch (error) {
    console.error('Submit news error:', error);
    res.status(500).json({ error: 'Failed to submit news' });
  }
});

// Get user's submitted news
router.get('/user/submissions', authenticateToken, requireReporter, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { author: req.user._id };
    if (status) filter.status = status;

    const news = await News.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await News.countDocuments(filter);

    res.json({
      news,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: skip + news.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Update news article (only by author)
router.put('/:id', authenticateToken, requireReporter, [
  body('title').optional().trim().isLength({ min: 10, max: 200 }),
  body('content').optional().trim().isLength({ min: 50 }),
  body('category').optional().isIn(['agriculture', 'education', 'health', 'infrastructure', 'scheme', 'event', 'other']),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'News article not found' });
    }

    // Check if user is the author or admin
    if (news.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to edit this article' });
    }

    // Only allow editing if status is pending
    if (news.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({ error: 'Cannot edit approved or published articles' });
    }

    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.content) updateData.content = req.body.content;
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.tags) updateData.tags = req.body.tags;
    if (req.body.images) updateData.images = req.body.images;
    if (req.body.videos) updateData.videos = req.body.videos;

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email village');

    res.json({
      message: 'News updated successfully',
      news: updatedNews
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ error: 'Failed to update news' });
  }
});

// Delete news article (only by author or admin)
router.delete('/:id', authenticateToken, requireReporter, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'News article not found' });
    }

    // Check if user is the author or admin
    if (news.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this article' });
    }

    await News.findByIdAndDelete(req.params.id);

    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

// Like/Unlike news article
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'News article not found' });
    }

    // For now, just increment like count (in real app, track user likes)
    news.likeCount += 1;
    await news.save();

    res.json({ message: 'News liked successfully', likeCount: news.likeCount });
  } catch (error) {
    console.error('Like news error:', error);
    res.status(500).json({ error: 'Failed to like news' });
  }
});

// Share news article
router.post('/:id/share', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'News article not found' });
    }

    news.shareCount += 1;
    await news.save();

    res.json({ message: 'News shared successfully', shareCount: news.shareCount });
  } catch (error) {
    console.error('Share news error:', error);
    res.status(500).json({ error: 'Failed to share news' });
  }
});

module.exports = router;
