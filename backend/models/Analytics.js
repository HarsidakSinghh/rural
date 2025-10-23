const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  totalUsers: {
    type: Number,
    default: 0
  },
  totalNews: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  approvedSubmissions: {
    type: Number,
    default: 0
  },
  rejectedSubmissions: {
    type: Number,
    default: 0
  },
  pendingSubmissions: {
    type: Number,
    default: 0
  },
  categoryBreakdown: {
    agriculture: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    infrastructure: { type: Number, default: 0 },
    scheme: { type: Number, default: 0 },
    event: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  villageBreakdown: [{
    village: String,
    count: Number
  }],
  topVillages: [{
    village: String,
    submissions: Number,
    views: Number
  }],
  userActivity: {
    newRegistrations: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    trustedUsers: { type: Number, default: 0 }
  },
  performance: {
    averageApprovalTime: { type: Number, default: 0 }, // in hours
    approvalRate: { type: Number, default: 0 }, // percentage
    averageViewsPerNews: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for date queries
analyticsSchema.index({ date: -1 });

// Method to update analytics
analyticsSchema.methods.updateAnalytics = function(data) {
  Object.keys(data).forEach(key => {
    if (this.schema.paths[key]) {
      this[key] = data[key];
    }
  });
  return this.save();
};

// Static method to get analytics for date range
analyticsSchema.statics.getAnalyticsRange = function(startDate, endDate) {
  return this.find({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: -1 });
};

// Static method to get latest analytics
analyticsSchema.statics.getLatestAnalytics = function() {
  return this.findOne().sort({ date: -1 });
};

module.exports = mongoose.model('Analytics', analyticsSchema);
