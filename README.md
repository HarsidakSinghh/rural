# GramPulse - Rural Newsroom Platform

A mobile-first, community-driven digital newsroom platform designed for rural communities in India. This platform enables students and village reporters to document, report, and circulate local news, issues, cultural stories, and government schemes from neighboring villages.

## 🌟 Key Features

### 📱 Mobile-First Design
- Optimized for mobile browsers with responsive design
- Low-bandwidth optimized for rural internet connectivity
- Touch-friendly interface for easy navigation

### 🌐 Multi-Language Support
- **English** - Primary language
- **Hindi** - हिंदी support for Hindi-speaking regions
- **Punjabi** - ਪੰਜਾਬੀ support for Punjab region
- Easy language toggle in the header

### 📍 Geo-Tagging & Location Services
- Automatic location detection for news submissions
- GPS coordinates for better story context
- Village-based content organization

### 🎤 Audio Support for Illiterate Users
- Audio file upload functionality
- Voice recording capabilities
- Audio playback for news consumption

### 📞 SMS/IVR Integration (Planned)
- SMS-based news submission
- IVR (Interactive Voice Response) system
- Offline-first capability for areas with poor connectivity

### 👨‍💼 Admin Dashboard
- Student editor moderation panel
- Content approval/rejection workflow
- Analytics and reporting tools
- User management system

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **React Router** for navigation
- **Lucide React** for icons
- **CSS3** with mobile-first responsive design

### Key Components
- **LanguageContext** - Multi-language support
- **AuthContext** - User authentication and role management
- **Header** - Navigation and language toggle
- **Home** - News listing with category filters
- **SubmitNews** - News submission form with audio support
- **NewsDetail** - Individual article view
- **AdminDashboard** - Content moderation panel
- **Login** - User authentication

### Data Types
- **NewsArticle** - Published news content
- **NewsSubmission** - Pending content for review
- **Village** - Geographic data
- **AdminStats** - Analytics data
- **AudioRecording** - Audio content
- **LocationData** - GPS coordinates

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rural-newsroom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## 📱 Usage Guide

### For Village Reporters

1. **Submit News**
   - Click "Submit News" in the navigation
   - Fill in the required fields (title, content, village, author)
   - Add location data (optional)
   - Upload audio files (optional)
   - Submit for review

2. **Audio Submission**
   - Use the audio upload feature for voice-based reporting
   - Record directly in the browser or upload audio files
   - Perfect for users with limited literacy

### For Student Editors (Admins)

1. **Login**
   - Use admin credentials to access the dashboard
   - Demo credentials: admin / password

2. **Content Moderation**
   - Review pending submissions
   - Approve or reject content
   - Add admin notes for rejected content
   - View analytics and statistics

3. **Dashboard Features**
   - Overview of all submissions
   - Filter by status (pending, published, rejected)
   - View detailed submission information
   - Manage content lifecycle

### For Readers

1. **Browse News**
   - View latest news on the home page
   - Filter by categories (news, schemes, culture, issues, events)
   - Read full articles by clicking on news items

2. **Language Support**
   - Toggle between English, Hindi, and Punjabi
   - All content and interface elements are translated

## 🎯 Target Users

### Primary Users
- **Village Reporters** - Local community members reporting news
- **Student Editors** - College students managing content
- **Rural Readers** - Community members consuming news

### Supported Villages
- Designed for 15 neighboring villages
- Scalable to more villages as needed
- Village-specific content organization

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=your_api_endpoint
REACT_APP_GOOGLE_MAPS_API_KEY=your_maps_api_key
REACT_APP_SMS_GATEWAY_URL=your_sms_gateway
REACT_APP_IVR_NUMBER=your_ivr_number
```

### Customization
- **Villages**: Update village data in the types
- **Categories**: Modify news categories as needed
- **Languages**: Add more languages in LanguageContext
- **Styling**: Customize CSS in App.css

## 📊 Features Roadmap

### Phase 1 (Current)
- ✅ Basic news submission and viewing
- ✅ Multi-language support
- ✅ Mobile-responsive design
- ✅ Admin dashboard
- ✅ Audio upload support

### Phase 2 (Planned)
- 🔄 SMS integration
- 🔄 IVR system
- 🔄 Offline-first capability
- 🔄 Push notifications
- 🔄 Advanced analytics

### Phase 3 (Future)
- 📋 AI-powered content moderation
- 📋 Voice-to-text transcription
- 📋 Community engagement features
- 📋 Integration with government portals

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for rural communities in India
- Designed with accessibility and low-literacy users in mind
- Inspired by community journalism principles
- Supported by student volunteers and local reporters

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Reach out to local community coordinators

---

**GramPulse** - Empowering rural voices through digital journalism 🏘️📰
