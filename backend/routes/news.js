const express = require('express');
const { body, validationResult, query } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const News = require('../models/News');
const User = require('../models/User');
const { authenticateToken, requireReporter, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

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
      .limit(parseInt(limit))
      .lean();

    // Convert ObjectIds to strings for frontend compatibility
    const serializedNews = news.map(item => ({
      ...item,
      id: item._id.toString(),
      author: typeof item.author === 'object' && item.author !== null ? {
        ...item.author,
        id: item.author._id ? item.author._id.toString() : '',
        _id: item.author._id ? item.author._id.toString() : ''
      } : item.author
    }));

    const total = await News.countDocuments(filter);

    res.json({
      news: serializedNews,
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
    const newsId = req.params.id;
    console.log('Fetching news with ID:', newsId);

    const news = await News.findById(newsId)
      .populate('author', 'name email village')
      .populate('approvedBy', 'name');

    if (!news) {
      console.log('News not found for ID:', newsId);
      return res.status(404).json({ error: 'News article not found' });
    }

    // Increment view count
    await news.incrementViewCount();

    // Convert ObjectIds to strings for frontend compatibility
    const serializedNews = {
      ...news.toObject(),
      id: news._id.toString(),
      author: typeof news.author === 'object' && news.author !== null ? {
        ...news.author,
        id: news.author._id ? news.author._id.toString() : '',
        _id: news.author._id ? news.author._id.toString() : ''
      } : news.author,
      approvedBy: typeof news.approvedBy === 'object' && news.approvedBy !== null ? {
        ...news.approvedBy,
        id: news.approvedBy._id ? news.approvedBy._id.toString() : '',
        _id: news.approvedBy._id ? news.approvedBy._id.toString() : ''
      } : news.approvedBy
    };

    res.json(serializedNews);
  } catch (error) {
    console.error('Get news detail error:', error);
    res.status(500).json({ error: 'Failed to fetch news article' });
  }
});

// Submit new news article
router.post('/', authenticateToken, upload.array('images', 5), [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content must be at least 1 character'),
  body('category').isIn(['agriculture', 'education', 'health', 'infrastructure', 'scheme', 'event', 'other', 'news', 'culture', 'issue']).withMessage('Invalid category'),
  body('village').trim().isLength({ min: 1, max: 100 }).withMessage('Village name required'),
  body('location.latitude').optional().isFloat().withMessage('Valid latitude required'),
  body('location.longitude').optional().isFloat().withMessage('Valid longitude required'),
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
      videos = [],
      priority = 'medium',
      isBreaking = false
    } = req.body;

    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => ({
        url: `/uploads/images/${file.filename}`,
        caption: req.body[`caption_${file.originalname}`] || '',
        alt: req.body[`alt_${file.originalname}`] || file.originalname
      }));
    }

    const news = new News({
      title,
      content,
      category,
      village,
      author: req.user.id || req.user._id,
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

    // Update user's total submissions (only for database users)
    if (req.user.id && req.user.id !== req.user._id) {
      // This is a predefined account, don't update database
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { totalSubmissions: 1 },
        lastSubmissionDate: new Date()
      });
    }

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
router.get('/user/submissions', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { author: req.user.id || req.user._id };
    if (status) filter.status = status;

    const news = await News.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Convert ObjectIds to strings for frontend compatibility
    const serializedNews = news.map(item => ({
      ...item,
      id: item._id.toString(),
      author: typeof item.author === 'object' && item.author !== null ? {
        ...item.author,
        id: item.author._id ? item.author._id.toString() : '',
        _id: item.author._id ? item.author._id.toString() : ''
      } : item.author
    }));

    const total = await News.countDocuments(filter);

    res.json({
      news: serializedNews,
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
router.put('/:id', authenticateToken, [
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
    const userId = req.user.id || req.user._id;
    if (news.author.toString() !== userId.toString() && req.user.role !== 'admin') {
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

    // Convert ObjectIds to strings for frontend compatibility
    const serializedNews = {
      ...updatedNews.toObject(),
      id: updatedNews._id.toString(),
      author: typeof updatedNews.author === 'object' && updatedNews.author !== null ? {
        ...updatedNews.author,
        id: updatedNews.author._id ? updatedNews.author._id.toString() : '',
        _id: updatedNews.author._id ? updatedNews.author._id.toString() : ''
      } : updatedNews.author
    };

    res.json({
      message: 'News updated successfully',
      news: serializedNews
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ error: 'Failed to update news' });
  }
});

// Delete news article (only by author or admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'News article not found' });
    }

    // Check if user is the author or admin
    const userId = req.user.id || req.user._id;
    if (news.author.toString() !== userId.toString() && req.user.role !== 'admin') {
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

// Upload image for news article
router.post('/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Create URL for the uploaded image
    const imageUrl = `/uploads/images/${req.file.filename}`;

    res.json({
      message: 'Image uploaded successfully',
      image: {
        url: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
