# Rural Newsroom Backend API

A comprehensive backend API for the Rural Newsroom application built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Reporter, Viewer)
  - User registration and login
  - Profile management

- 📰 **News Management**
  - Submit news articles with geo-tagging
  - Category-based organization
  - Image and video support
  - Approval workflow for reporters

- 👥 **User Management**
  - User profiles with statistics
  - Trust system (20+ approved submissions)
  - Monthly and total submission tracking
  - Performance analytics

- 📊 **Admin Dashboard**
  - Comprehensive statistics
  - Pending submissions management
  - User management
  - Analytics and reporting

- 🌐 **API Features**
  - RESTful API design
  - Rate limiting
  - Input validation
  - Error handling
  - CORS support

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### News
- `GET /api/news` - Get all published news (with filters)
- `GET /api/news/:id` - Get single news article
- `POST /api/news` - Submit new news (Reporters only)
- `PUT /api/news/:id` - Update news article
- `DELETE /api/news/:id` - Delete news article
- `GET /api/news/user/submissions` - Get user's submissions
- `POST /api/news/:id/like` - Like news article
- `POST /api/news/:id/share` - Share news article

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/pending` - Get pending submissions
- `POST /api/admin/approve/:id` - Approve news submission
- `POST /api/admin/reject/:id` - Reject news submission
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/analytics` - Get analytics data

### User
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/profile` - Get detailed user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/submissions` - Get user's submissions
- `GET /api/user/performance` - Get user performance metrics

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Copy `env.example` to `.env` and configure:

```bash
cp env.example .env
```

Required environment variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URL` - Frontend application URL

### 3. Database Setup
1. Create a MongoDB Atlas account or use local MongoDB
2. Create a database named `rural-newsroom`
3. Update `MONGODB_URI` in your `.env` file

### 4. Run Application
```bash
# Development
npm run dev

# Production
npm start
```

## Deployment to Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
cd backend
vercel
```

### 4. Environment Variables in Vercel
Add these environment variables in your Vercel dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `NODE_ENV=production`

## Database Schema

### User Model
- Basic info: name, email, phone, village
- Authentication: password (hashed)
- Role: admin, reporter, viewer
- Trust system: isTrusted, approvedSubmissions
- Statistics: totalSubmissions, totalViews, monthlySubmissions

### News Model
- Content: title, content, category
- Location: village, geo-coordinates
- Author: reference to User
- Status: pending, approved, rejected, published
- Engagement: viewCount, likeCount, shareCount
- Media: images, videos
- SEO: seoTitle, seoDescription, seoKeywords

### Analytics Model
- Daily statistics tracking
- Category breakdowns
- Village-wise analytics
- User activity metrics
- Performance indicators

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Input validation
- CORS configuration
- Helmet security headers

## Predefined Accounts

For testing, these accounts are available:

**Admin:**
- Email: admin@ruralnews.com
- Password: admin123

**Trusted Reporter:**
- Email: rajesh@ruralnews.com
- Password: reporter123

**New Reporter:**
- Email: priya@ruralnews.com
- Password: reporter123

## API Documentation

The API follows RESTful conventions and returns JSON responses. All endpoints require authentication except:
- Health check: `GET /api/health`
- Public news: `GET /api/news`

## Error Handling

The API returns consistent error responses:
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP
- Applied to all `/api/` routes

## CORS Configuration

Configured to allow requests from the frontend URL specified in `FRONTEND_URL` environment variable.
