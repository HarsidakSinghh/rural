const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const News = require('./models/News');

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully!');

    // Clear existing data
    await User.deleteMany({});
    await News.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create sample users
    const users = [
      {
        name: 'Ram Singh',
        email: 'ram.singh@example.com',
        phone: '9876543210',
        village: 'Village A',
        role: 'reporter',
        password: 'password123',
        isTrusted: true,
        approvedSubmissions: 5,
        totalSubmissions: 7,
        totalViews: 150,
        monthlySubmissions: 3
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '9876543211',
        village: 'Village B',
        role: 'reporter',
        password: 'password123',
        isTrusted: false,
        approvedSubmissions: 2,
        totalSubmissions: 4,
        totalViews: 80,
        monthlySubmissions: 1
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '9876543212',
        village: 'City Center',
        role: 'admin',
        password: 'admin123',
        isTrusted: true
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('👥 Created sample users');

    // Create sample news
    const news = [
      {
        title: 'New Water Supply Scheme Launched',
        content: 'The government has launched a new water supply scheme in our village. This initiative will provide clean drinking water to over 500 households. The project includes installation of new pipelines and water treatment facilities.',
        category: 'scheme',
        village: 'Village A',
        author: createdUsers[0]._id,
        authorName: createdUsers[0].name,
        status: 'published',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        location: { latitude: 28.6139, longitude: 77.2090, address: 'Village A Main Road' },
        isGeoTagged: true,
        tags: ['water', 'scheme', 'government'],
        viewCount: 45,
        likeCount: 12,
        shareCount: 3,
        priority: 'high',
        isBreaking: false,
        isFeatured: true,
        approvedBy: createdUsers[2]._id,
        approvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Traditional Dance Festival Celebrated',
        content: 'Our village celebrated the annual traditional dance festival with great enthusiasm. Local artists performed various folk dances showcasing our rich cultural heritage.',
        category: 'event',
        village: 'Village A',
        author: createdUsers[0]._id,
        authorName: createdUsers[0].name,
        status: 'published',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        location: { latitude: 28.6139, longitude: 77.2090, address: 'Village A Community Center' },
        isGeoTagged: true,
        tags: ['festival', 'culture', 'dance'],
        viewCount: 32,
        likeCount: 8,
        shareCount: 2,
        priority: 'medium',
        isBreaking: false,
        isFeatured: false,
        approvedBy: createdUsers[2]._id,
        approvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Road Repair Work Begins',
        content: 'The long-awaited road repair work has finally begun in our village. The contractor has started fixing potholes and resurfacing the main roads.',
        category: 'infrastructure',
        village: 'Village A',
        author: createdUsers[0]._id,
        authorName: createdUsers[0].name,
        status: 'published',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        location: { latitude: 28.6139, longitude: 77.2090, address: 'Village A Main Road' },
        isGeoTagged: true,
        tags: ['roads', 'repair', 'infrastructure'],
        viewCount: 28,
        likeCount: 5,
        shareCount: 1,
        priority: 'medium',
        isBreaking: false,
        isFeatured: false,
        approvedBy: createdUsers[2]._id,
        approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'New Health Camp Organized',
        content: 'A health camp was organized by the local NGO providing free medical checkups and consultations to villagers.',
        category: 'health',
        village: 'Village B',
        author: createdUsers[1]._id,
        authorName: createdUsers[1].name,
        status: 'published',
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        location: { latitude: 28.7041, longitude: 77.1025, address: 'Village B Health Center' },
        isGeoTagged: true,
        tags: ['health', 'camp', 'medical'],
        viewCount: 25,
        likeCount: 7,
        shareCount: 2,
        priority: 'medium',
        isBreaking: false,
        isFeatured: false,
        approvedBy: createdUsers[2]._id,
        approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Agricultural Training Program',
        content: 'Farmers participated in a training program on modern farming techniques and sustainable agriculture practices.',
        category: 'agriculture',
        village: 'Village B',
        author: createdUsers[1]._id,
        authorName: createdUsers[1].name,
        status: 'published',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        location: { latitude: 28.7041, longitude: 77.1025, address: 'Village B Farm' },
        isGeoTagged: true,
        tags: ['agriculture', 'training', 'farming'],
        viewCount: 30,
        likeCount: 10,
        shareCount: 3,
        priority: 'medium',
        isBreaking: false,
        isFeatured: false,
        approvedBy: createdUsers[2]._id,
        approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'School Renovation Completed',
        content: 'The renovation work at the local school has been completed. New classrooms, furniture, and educational materials have been provided.',
        category: 'education',
        village: 'Village A',
        author: createdUsers[0]._id,
        authorName: createdUsers[0].name,
        status: 'pending',
        location: { latitude: 28.6139, longitude: 77.2090, address: 'Village A School' },
        isGeoTagged: true,
        tags: ['school', 'education', 'renovation'],
        priority: 'high',
        isBreaking: false,
        isFeatured: false
      },
      {
        title: 'Community Meeting Held',
        content: 'A community meeting was held to discuss upcoming development projects and address local concerns.',
        category: 'event',
        village: 'Village B',
        author: createdUsers[1]._id,
        authorName: createdUsers[1].name,
        status: 'pending',
        location: { latitude: 28.7041, longitude: 77.1025, address: 'Village B Community Hall' },
        isGeoTagged: true,
        tags: ['meeting', 'community', 'development'],
        priority: 'medium',
        isBreaking: false,
        isFeatured: false
      }
    ];

    await News.insertMany(news);
    console.log('📰 Created sample news articles');

    // Update user stats based on news
    for (const user of createdUsers) {
      if (user.role === 'reporter') {
        const userNews = await News.find({ author: user._id });
        const publishedNews = userNews.filter(n => n.status === 'published');
        const totalViews = publishedNews.reduce((sum, n) => sum + n.viewCount, 0);

        await User.findByIdAndUpdate(user._id, {
          totalSubmissions: userNews.length,
          approvedSubmissions: publishedNews.length,
          totalViews: totalViews,
          lastSubmissionDate: userNews.length > 0 ? userNews[0].createdAt : null
        });
      }
    }
    console.log('📊 Updated user statistics');

    console.log('✅ Database seeded successfully!');
    console.log('Sample users:');
    console.log('- Reporter: ram.singh@example.com / password123');
    console.log('- Reporter: priya.sharma@example.com / password123');
    console.log('- Admin: admin@example.com / admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

seedDatabase();
