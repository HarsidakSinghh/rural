const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  village: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'reporter', 'viewer'],
    default: 'reporter'
  },
  isTrusted: {
    type: Boolean,
    default: false
  },
  approvedSubmissions: {
    type: Number,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  monthlySubmissions: {
    type: Number,
    default: 0
  },
  lastSubmissionDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  socialLinks: {
    twitter: String,
    facebook: String,
    instagram: String
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update monthly submissions
userSchema.methods.updateMonthlySubmissions = function() {
  const now = new Date();
  const lastSubmission = this.lastSubmissionDate;
  
  if (!lastSubmission) {
    this.monthlySubmissions = 0;
    return;
  }
  
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = lastSubmission.getMonth();
  const lastYear = lastSubmission.getFullYear();
  
  if (currentMonth !== lastMonth || currentYear !== lastYear) {
    this.monthlySubmissions = 0;
  }
};

// Check if user is trusted (20+ approved submissions)
userSchema.methods.checkTrustStatus = function() {
  this.isTrusted = this.approvedSubmissions >= 20;
  return this.isTrusted;
};

module.exports = mongoose.model('User', userSchema);
