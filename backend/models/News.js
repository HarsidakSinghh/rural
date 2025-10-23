const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    minlength: 50
  },
  category: {
    type: String,
    required: true,
    enum: ['agriculture', 'education', 'health', 'infrastructure', 'scheme', 'event', 'other']
  },
  village: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'published'],
    default: 'pending'
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    address: String
  },
  isGeoTagged: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  },
  images: [{
    url: String,
    caption: String,
    alt: String
  }],
  videos: [{
    url: String,
    caption: String,
    thumbnail: String
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isBreaking: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String]
}, {
  timestamps: true
});

// Index for better query performance
newsSchema.index({ status: 1, publishedAt: -1 });
newsSchema.index({ category: 1, status: 1 });
newsSchema.index({ village: 1, status: 1 });
newsSchema.index({ author: 1, status: 1 });
newsSchema.index({ isFeatured: 1, publishedAt: -1 });
newsSchema.index({ isBreaking: 1, publishedAt: -1 });

// Virtual for excerpt
newsSchema.virtual('excerpt').get(function() {
  return this.content.length > 150 
    ? this.content.substring(0, 150) + '...' 
    : this.content;
});

// Method to increment view count
newsSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Method to approve news
newsSchema.methods.approve = function(adminId) {
  this.status = 'approved';
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  return this.save();
};

// Method to reject news
newsSchema.methods.reject = function(reason) {
  this.status = 'rejected';
  this.rejectionReason = reason;
  return this.save();
};

// Method to publish news
newsSchema.methods.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('News', newsSchema);
