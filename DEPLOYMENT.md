# Rural Newsroom - Deployment Guide

This guide will help you deploy both the frontend and backend of the Rural Newsroom application to Vercel.

## Prerequisites

1. **GitHub Account** - For code repository
2. **Vercel Account** - For deployment
3. **MongoDB Atlas Account** - For database
4. **Node.js** - For local development

## Step 1: Database Setup

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database named `rural-newsroom`

### 1.2 Get Connection String
1. In MongoDB Atlas, go to "Database Access"
2. Create a new database user
3. Go to "Network Access" and add your IP (or 0.0.0.0/0 for all IPs)
4. Go to "Clusters" and click "Connect"
5. Copy the connection string (replace `<password>` with your user password)

## Step 2: Backend Deployment

### 2.1 Prepare Backend
```bash
cd rural-newsroom/backend
npm install
```

### 2.2 Deploy to Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy backend: `vercel`
4. Follow the prompts:
   - Set project name: `rural-newsroom-backend`
   - Set framework: `Other`
   - Set build command: `echo "No build required"`
   - Set output directory: `.`

### 2.3 Configure Environment Variables
In Vercel dashboard, go to your backend project settings and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rural-newsroom
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### 2.4 Get Backend URL
After deployment, copy your backend URL (e.g., `https://rural-newsroom-backend.vercel.app`)

## Step 3: Frontend Deployment

### 3.1 Update Frontend Configuration
1. Update `rural-newsroom/vercel.json`:
```json
{
  "env": {
    "REACT_APP_API_URL": "https://your-backend.vercel.app/api"
  }
}
```

2. Create `.env` file in frontend root:
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

### 3.2 Deploy Frontend
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy frontend: `vercel`
4. Follow the prompts:
   - Set project name: `rural-newsroom-frontend`
   - Set framework: `Create React App`
   - Set build command: `npm run build`
   - Set output directory: `build`

### 3.3 Configure Environment Variables
In Vercel dashboard, go to your frontend project settings and add:

```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

## Step 4: Update Backend CORS

After getting your frontend URL, update the backend environment variables:

1. Go to your backend project in Vercel dashboard
2. Update environment variables:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

3. Redeploy the backend: `vercel --prod`

## Step 5: Test Deployment

### 5.1 Test Backend
Visit: `https://your-backend.vercel.app/api/health`

Should return:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 5.2 Test Frontend
1. Visit your frontend URL
2. Try registering a new user
3. Try logging in with predefined accounts:
   - Admin: `admin@ruralnews.com` / `admin123`
   - Reporter: `rajesh@ruralnews.com` / `reporter123`

## Step 6: Domain Setup (Optional)

### 6.1 Custom Domain for Frontend
1. In Vercel dashboard, go to your frontend project
2. Go to "Settings" > "Domains"
3. Add your custom domain
4. Update DNS settings as instructed

### 6.2 Custom Domain for Backend
1. In Vercel dashboard, go to your backend project
2. Go to "Settings" > "Domains"
3. Add your custom domain
4. Update the `REACT_APP_API_URL` in frontend environment variables

## Environment Variables Summary

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rural-newsroom
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in backend matches your frontend domain
   - Check that the backend is deployed and accessible

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings in MongoDB Atlas
   - Ensure database user has proper permissions

3. **Authentication Issues**
   - Check JWT_SECRET is set correctly
   - Verify token is being sent in requests
   - Check browser console for errors

4. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are installed
   - Check for TypeScript errors

### Debugging Steps

1. **Check Backend Logs**
   ```bash
   vercel logs your-backend-project
   ```

2. **Check Frontend Build**
   ```bash
   npm run build
   ```

3. **Test API Endpoints**
   ```bash
   curl https://your-backend.vercel.app/api/health
   ```

## Production Checklist

- [ ] Database connection working
- [ ] Backend API accessible
- [ ] Frontend builds successfully
- [ ] Authentication working
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Custom domains configured (if applicable)
- [ ] SSL certificates active
- [ ] Performance monitoring set up

## Monitoring and Maintenance

### 1. Monitor Performance
- Use Vercel Analytics for frontend
- Monitor backend logs for errors
- Set up MongoDB Atlas monitoring

### 2. Regular Updates
- Keep dependencies updated
- Monitor security vulnerabilities
- Backup database regularly

### 3. Scaling
- Upgrade MongoDB Atlas plan if needed
- Consider Vercel Pro for higher limits
- Implement caching strategies

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas connection
5. Review browser console for frontend errors

## Cost Estimation

### Free Tier Limits
- **Vercel**: 100GB bandwidth, 1000 serverless function invocations
- **MongoDB Atlas**: 512MB storage, shared clusters
- **Total**: $0/month for small applications

### Paid Plans (if needed)
- **Vercel Pro**: $20/month
- **MongoDB Atlas M10**: $9/month
- **Total**: ~$29/month for production use
