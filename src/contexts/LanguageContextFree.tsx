import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'pa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateContent: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  en: {
    // Navigation
    'home': 'Home',
    'submit_news': 'Submit News',
    'admin': 'Admin',
    'login': 'Login',
    'logout': 'Logout',

    // Home page
    'latest_news': 'Latest News',
    'local_news': 'Local News',
    'government_schemes': 'Government Schemes',
    'cultural_stories': 'Cultural Stories',
    'village_issues': 'Village Issues',

    // News submission
    'submit_story': 'Submit Your Story',
    'title': 'Title',
    'content': 'Content',
    'category': 'Category',
    'village': 'Village',
    'upload_audio': 'Upload Audio',
    'record_audio': 'Record Audio',
    'submit': 'Submit',
    'cancel': 'Cancel',

    // Categories
    'news': 'News',
    'scheme': 'Government Scheme',
    'culture': 'Culture',
    'issue': 'Issue',
    'event': 'Event',
    'agriculture': 'Agriculture',
    'education': 'Education',
    'health': 'Health',
    'infrastructure': 'Infrastructure',
    'other': 'Other',

    // Admin
    'dashboard': 'Dashboard',
    'pending_reviews': 'Pending Reviews',
    'published': 'Published',
    'rejected': 'Rejected',
    'total_submissions': 'Total Submissions',
    'approve': 'Approve',
    'reject': 'Reject',
    'edit': 'Edit',
    'delete': 'Delete',

    // Common
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'save': 'Save',
    'back': 'Back',
    'next': 'Next',
    'previous': 'Previous',
    'no_news_found': 'No news found',
    'share_your_story': 'Share Your Story',
    'contribute_to_community': 'Contribute to your community by sharing local news and stories',
    'submission_success': 'News submitted successfully!',
    'submission_error': 'Error submitting news. Please try again.',
    'submitting': 'Submitting...',
    'location_updated': 'Location Updated',
    'location_access_denied': 'Location access denied',
    'views': 'views',
    'back_to_news': 'Back to News',
    'geo_tagged': 'Geo-tagged',
    'related_articles': 'Related Articles',
    'no_related_articles': 'No related articles found',
    'article_not_found': 'Article not found',
    'username': 'Username',
    'password': 'Password',
    'role': 'Role',
    'reporter': 'Reporter',
    'logging_in': 'Logging in...',
    'invalid_credentials': 'Invalid credentials',
    'login_error': 'Login error',
    'demo_credentials': 'Demo Credentials',
    'access_denied': 'Access denied',
    'admin_dashboard': 'Admin Dashboard',
    'overview': 'Overview',
    'author': 'Author',
    'admin_notes': 'Admin Notes',
    'view': 'View',
    'no_submissions_found': 'No submissions found',
    'text_submission': 'Text Submission',
    'audio_submission': 'Audio Submission',
    'author_name': 'Author Name',
    'enter_title': 'Enter title',
    'enter_password': 'Enter password',
    'enter_content': 'Enter content',
    'enter_village': 'Enter village name',
    'enter_author_name': 'Enter author name',
    'enter_phone': 'Enter phone number',
    'add_tag': 'Add tag',
    'add': 'Add',
    'tags': 'Tags',
    'fill_required_fields': 'Please fill all required fields',
    'welcome_to_gram_samachar': 'Welcome to GramPulse',
    'community_news_platform': 'Your Community News Platform',
    '15_villages': '15 Villages',
    '3_languages': '3 Languages',
    'try_different_category': 'Try selecting a different category',

    // Audio
    'start_recording': 'Start Recording',
    'stop_recording': 'Stop Recording',
    'recording': 'Recording...',
    'audio_upload': 'Audio Upload',
    'drag_drop_audio': 'Drag and drop audio file here or click to select',

    // Location
    'location': 'Location',
    'enable_location': 'Enable Location',
    'location_disabled': 'Location access disabled',

    // SMS/IVR
    'sms_submit': 'Submit via SMS',
    'ivr_submit': 'Submit via IVR',
    'phone_number': 'Phone Number',
    'send_sms': 'Send SMS',
    'call_ivr': 'Call IVR Number',

    // Home page sections
    'top_stories': 'Top Stories',
    'safe_verified': 'Safe & Verified',
    'zero_tolerance': 'Zero tolerance on spam',
    'trending_topics': 'Trending Topics',
    'from_the_desk': 'From the Desk',
    'grassroots_stories': 'Grassroots stories shape better decisions. Explore developments, issues, and culture from villages across the region—reported by the community.',
    'most_read': 'Most Read',
    'regional_highlights': 'Regional Highlights',
    'weekly_brief': 'Weekly Brief',
    'newsletter_sub': 'Top stories and rural insights in your inbox.',
    'subscribe': 'Subscribe',
    'translated': 'Translated',
  },
  hi: {
    // Navigation
    'home': 'होम',
    'submit_news': 'समाचार सबमिट करें',
    'admin': 'एडमिन',
    'login': 'लॉगिन',
    'logout': 'लॉगआउट',

    // Home page
    'latest_news': 'ताजा समाचार',
    'local_news': 'स्थानीय समाचार',
    'government_schemes': 'सरकारी योजनाएं',
    'cultural_stories': 'सांस्कृतिक कहानियां',
    'village_issues': 'गांव के मुद्दे',

    // News submission
    'submit_story': 'अपनी कहानी सबमिट करें',
    'title': 'शीर्षक',
    'content': 'विषय',
    'category': 'श्रेणी',
    'village': 'गांव',
    'upload_audio': 'ऑडियो अपलोड करें',
    'record_audio': 'ऑडियो रिकॉर्ड करें',
    'submit': 'सबमिट करें',
    'cancel': 'रद्द करें',

    // Categories
    'news': 'समाचार',
    'scheme': 'सरकारी योजना',
    'culture': 'संस्कृति',
    'issue': 'मुद्दा',
    'event': 'कार्यक्रम',
    'agriculture': 'कृषि',
    'education': 'शिक्षा',
    'health': 'स्वास्थ्य',
    'infrastructure': 'अवसंरचना',
    'other': 'अन्य',

    // Admin
    'dashboard': 'डैशबोर्ड',
    'pending_reviews': 'पेंडिंग रिव्यू',
    'published': 'प्रकाशित',
    'rejected': 'अस्वीकृत',
    'total_submissions': 'कुल सबमिशन',
    'approve': 'स्वीकृत करें',
    'reject': 'अस्वीकृत करें',
    'edit': 'संपादित करें',
    'delete': 'हटाएं',

    // Common
    'loading': 'लोड हो रहा है...',
    'error': 'त्रुटि',
    'success': 'सफल',
    'save': 'सहेजें',
    'back': 'वापस',
    'next': 'अगला',
    'previous': 'पिछला',
    'no_news_found': 'कोई समाचार नहीं मिला',
    'share_your_story': 'अपनी कहानी साझा करें',
    'contribute_to_community': 'स्थानीय समाचार और कहानियां साझा करके अपने समुदाय में योगदान करें',
    'submission_success': 'समाचार सफलतापूर्वक सबमिट किया गया!',
    'submission_error': 'समाचार सबमिट करने में त्रुटि। कृपया पुनः प्रयास करें।',
    'submitting': 'सबमिट हो रहा है...',
    'location_updated': 'स्थान अपडेट किया गया',
    'location_access_denied': 'स्थान एक्सेस अस्वीकृत',
    'views': 'दृश्य',
    'back_to_news': 'समाचार पर वापस जाएं',
    'geo_tagged': 'जियो-टैग किया गया',
    'related_articles': 'संबंधित लेख',
    'no_related_articles': 'कोई संबंधित लेख नहीं मिला',
    'article_not_found': 'लेख नहीं मिला',
    'username': 'उपयोगकर्ता नाम',
    'password': 'पासवर्ड',
    'role': 'भूमिका',
    'reporter': 'रिपोर्टर',
    'logging_in': 'लॉगिन हो रहा है...',
    'invalid_credentials': 'अमान्य क्रेडेंशियल्स',
    'login_error': 'लॉगिन त्रुटि',
    'demo_credentials': 'डेमो क्रेडेंशियल्स',
    'access_denied': 'एक्सेस अस्वीकृत',
    'admin_dashboard': 'एडमिन डैशबोर्ड',
    'overview': 'अवलोकन',
    'author': 'लेखक',
    'admin_notes': 'एडमिन नोट्स',
    'view': 'देखें',
    'no_submissions_found': 'कोई सबमिशन नहीं मिला',
    'text_submission': 'टेक्स्ट सबमिशन',
    'audio_submission': 'ऑडियो सबमिशन',
    'author_name': 'लेखक का नाम',
    'enter_title': 'शीर्षक दर्ज करें',
    'enter_password': 'पासवर्ड दर्ज करें',
    'enter_content': 'विषय दर्ज करें',
    'enter_village': 'गांव का नाम दर्ज करें',
    'enter_author_name': 'लेखक का नाम दर्ज करें',
    'enter_phone': 'फोन नंबर दर्ज करें',
    'add_tag': 'टैग जोड़ें',
    'add': 'जोड़ें',
    'tags': 'टैग',
    'fill_required_fields': 'कृपया सभी आवश्यक फील्ड भरें',
    'welcome_to_gram_samachar': 'ग्रामपल्स में आपका स्वागत है',
    'community_news_platform': 'आपका समुदाय समाचार प्लेटफॉर्म',
    '15_villages': '15 गांव',
    '3_languages': '3 भाषाएं',
    'try_different_category': 'कोई अलग श्रेणी चुनने का प्रयास करें',

    // Audio
    'start_recording': 'रिकॉर्डिंग शुरू करें',
    'stop_recording': 'रिकॉर्डिंग रोकें',
    'recording': 'रिकॉर्डिंग...',
    'audio_upload': 'ऑडियो अपलोड',
    'drag_drop_audio': 'ऑडियो फाइल यहां खींचें या चुनने के लिए क्लिक करें',

    // Location
    'location': 'स्थान',
    'enable_location': 'स्थान सक्षम करें',
    'location_disabled': 'स्थान एक्सेस अक्षम',

    // SMS/IVR
    'sms_submit': 'एसएमएस के माध्यम से सबमिट करें',
    'ivr_submit': 'आईवीआर के माध्यम से सबमिट करें',
    'phone_number': 'फोन नंबर',
    'send_sms': 'एसएमएस भेजें',
    'call_ivr': 'आईवीआर नंबर पर कॉल करें',

    // Home page sections
    'top_stories': 'शीर्ष समाचार',
    'safe_verified': 'सुरक्षित और सत्यापित',
    'zero_tolerance': 'स्पैम के प्रति शून्य सहिष्णुता',
    'trending_topics': 'ट्रेंडिंग विषय',
    'from_the_desk': 'डेस्क से',
    'grassroots_stories': 'ग्रासरूट कहानियां बेहतर निर्णय लेती हैं। क्षेत्र के गांवों से विकास, मुद्दों और संस्कृति का पता लगाएं—समुदाय द्वारा रिपोर्ट किया गया।',
    'most_read': 'सबसे ज्यादा पढ़ा गया',
    'regional_highlights': 'क्षेत्रीय हाइलाइट्स',
    'weekly_brief': 'साप्ताहिक संक्षिप्त',
    'newsletter_sub': 'शीर्ष समाचार और ग्रामीण अंतर्दृष्टि आपके इनबॉक्स में।',
    'subscribe': 'सब्स्क्राइब करें',
    'translated': 'अनुवादित',
  },
  pa: {
    // Navigation
    'home': 'ਹੋਮ',
    'submit_news': 'ਸਮਾਚਾਰ ਸਬਮਿਟ ਕਰੋ',
    'admin': 'ਐਡਮਿਨ',
    'login': 'ਲੌਗਿਨ',
    'logout': 'ਲੌਗਆਉਟ',

    // Home page
    'latest_news': 'ਤਾਜ਼ਾ ਸਮਾਚਾਰ',
    'local_news': 'ਸਥਾਨੀ ਸਮਾਚਾਰ',
    'government_schemes': 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ',
    'cultural_stories': 'ਸੱਭਿਆਚਾਰਕ ਕਹਾਣੀਆਂ',
    'village_issues': 'ਪਿੰਡ ਦੇ ਮੁੱਦੇ',

    // News submission
    'submit_story': 'ਆਪਣੀ ਕਹਾਣੀ ਸਬਮਿਟ ਕਰੋ',
    'title': 'ਸਿਰਲੇਖ',
    'content': 'ਵਿਸ਼ਾ',
    'category': 'ਸ਼੍ਰੇਣੀ',
    'village': 'ਪਿੰਡ',
    'upload_audio': 'ਆਡੀਓ ਅਪਲੋਡ ਕਰੋ',
    'record_audio': 'ਆਡੀਓ ਰਿਕਾਰਡ ਕਰੋ',
    'submit': 'ਸਬਮਿਟ ਕਰੋ',
    'cancel': 'ਰੱਦ ਕਰੋ',

    // Categories
    'news': 'ਸਮਾਚਾਰ',
    'scheme': 'ਸਰਕਾਰੀ ਯੋਜਨਾ',
    'culture': 'ਸੱਭਿਆਚਾਰ',
    'issue': 'ਮੁੱਦਾ',
    'event': 'ਕਾਰਜਕ੍ਰਮ',
    'agriculture': 'ਖੇਤੀਬਾੜੀ',
    'education': 'ਸਿੱਖਿਆ',
    'health': 'ਸਿਹਤ',
    'infrastructure': 'ਇਨਫਰਾਸਟ੍ਰਕਚਰ',
    'other': 'ਹੋਰ',

    // Admin
    'dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    'pending_reviews': 'ਪੈਂਡਿੰਗ ਰਿਵਿਊ',
    'published': 'ਪ੍ਰਕਾਸ਼ਿਤ',
    'rejected': 'ਅਸਵੀਕ੍ਰਿਤ',
    'total_submissions': 'ਕੁੱਲ ਸਬਮਿਸ਼ਨ',
    'approve': 'ਸਵੀਕਾਰ ਕਰੋ',
    'reject': 'ਅਸਵੀਕਾਰ ਕਰੋ',
    'edit': 'ਸੰਪਾਦਿਤ ਕਰੋ',
    'delete': 'ਹਟਾਓ',

    // Common
    'loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'error': 'ਗਲਤੀ',
    'success': 'ਸਫਲ',
    'save': 'ਸੇਵ ਕਰੋ',
    'back': 'ਵਾਪਸ',
    'next': 'ਅਗਲਾ',
    'previous': 'ਪਿਛਲਾ',
    'no_news_found': 'ਕੋਈ ਸਮਾਚਾਰ ਨਹੀਂ ਮਿਲਿਆ',
    'share_your_story': 'ਆਪਣੀ ਕਹਾਣੀ ਸ਼ੇਅਰ ਕਰੋ',
    'contribute_to_community': 'ਸਥਾਨੀ ਸਮਾਚਾਰ ਅਤੇ ਕਹਾਣੀਆਂ ਸ਼ੇਅਰ ਕਰਕੇ ਆਪਣੇ ਸਮੁਦਾਇ ਵਿੱਚ ਯੋਗਦਾਨ ਕਰੋ',
    'submission_success': 'ਸਮਾਚਾਰ ਸਫਲਤਾਪੂਰਵਕ ਸਬਮਿਟ ਕੀਤਾ ਗਿਆ!',
    'submission_error': 'ਸਮਾਚਾਰ ਸਬਮਿਟ ਕਰਨ ਵਿੱਚ ਗਲਤੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    'submitting': 'ਸਬਮਿਟ ਹੋ ਰਿਹਾ ਹੈ...',
    'location_updated': 'ਸਥਾਨ ਅਪਡੇਟ ਕੀਤਾ ਗਿਆ',
    'location_access_denied': 'ਸਥਾਨ ਐਕਸੈਸ ਅਸਵੀਕ੍ਰਿਤ',
    'views': 'ਦ੍ਰਿਸ਼',
    'back_to_news': 'ਸਮਾਚਾਰ ਤੇ ਵਾਪਸ ਜਾਓ',
    'geo_tagged': 'ਜੀਓ-ਟੈਗ ਕੀਤਾ ਗਿਆ',
    'related_articles': 'ਸੰਬੰਧਿਤ ਲੇਖ',
    'no_related_articles': 'ਕੋਈ ਸੰਬੰਧਿਤ ਲੇਖ ਨਹੀਂ ਮਿਲਿਆ',
    'article_not_found': 'ਲੇਖ ਨਹੀਂ ਮਿਲਿਆ',
    'username': 'ਉਪਭੋਗਤਾ ਨਾਮ',
    'password': 'ਪਾਸਵਰਡ',
    'role': 'ਭੂਮਿਕਾ',
    'reporter': 'ਰਿਪੋਰਟਰ',
    'logging_in': 'ਲੌਗਿਨ ਹੋ ਰਿਹਾ ਹੈ...',
    'invalid_credentials': 'ਅਵੈਧ ਕ੍ਰੈਡੈਂਸ਼ੀਅਲ',
    'login_error': 'ਲੌਗਿਨ ਗਲਤੀ',
    'demo_credentials': 'ਡੈਮੋ ਕ੍ਰੈਡੈਂਸ਼ੀਅਲ',
    'access_denied': 'ਐਕਸੈਸ ਅਸਵੀਕ੍ਰਿਤ',
    'admin_dashboard': 'ਐਡਮਿਨ ਡੈਸ਼ਬੋਰਡ',
    'overview': 'ਅਵਲੋਕਨ',
    'author': 'ਲੇਖਕ',
    'admin_notes': 'ਐਡਮਿਨ ਨੋਟਸ',
    'view': 'ਦੇਖੋ',
    'no_submissions_found': 'ਕੋਈ ਸਬਮਿਸ਼ਨ ਨਹੀਂ ਮਿਲਿਆ',
    'text_submission': 'ਟੈਕਸਟ ਸਬਮਿਸ਼ਨ',
    'audio_submission': 'ਆਡੀਓ ਸਬਮਿਸ਼ਨ',
    'author_name': 'ਲੇਖਕ ਦਾ ਨਾਮ',
    'enter_title': 'ਸਿਰਲੇਖ ਦਰਜ ਕਰੋ',
    'enter_password': 'ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ',
    'enter_content': 'ਵਿਸ਼ਾ ਦਰਜ ਕਰੋ',
    'enter_village': 'ਪਿੰਡ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ',
    'enter_author_name': 'ਲੇਖਕ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ',
    'enter_phone': 'ਫੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ',
    'add_tag': 'ਟੈਗ ਜੋੜੋ',
    'add': 'ਜੋੜੋ',
    'tags': 'ਟੈਗ',
    'fill_required_fields': 'ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਲੋੜੀਂਦੇ ਫੀਲਡ ਭਰੋ',
    'welcome_to_gram_samachar': 'ਗ੍ਰਾਮਪਲਸ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ',
    'community_news_platform': 'ਤੁਹਾਡਾ ਸਮੁਦਾਇ ਸਮਾਚਾਰ ਪਲੇਟਫਾਰਮ',
    '15_villages': '15 ਪਿੰਡ',
    '3_languages': '3 ਭਾਸ਼ਾਵਾਂ',
    'try_different_category': 'ਕੋਈ ਵੱਖਰੀ ਸ਼੍ਰੇਣੀ ਚੁਣਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ',

    // Audio
    'start_recording': 'ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਕਰੋ',
    'stop_recording': 'ਰਿਕਾਰਡਿੰਗ ਰੋਕੋ',
    'recording': 'ਰਿਕਾਰਡਿੰਗ...',
    'audio_upload': 'ਆਡੀਓ ਅਪਲੋਡ',
    'drag_drop_audio': 'ਆਡੀਓ ਫਾਈਲ ਇੱਥੇ ਖਿੱਚੋ ਜਾਂ ਚੁਣਨ ਲਈ ਕਲਿਕ ਕਰੋ',

    // Location
    'location': 'ਸਥਾਨ',
    'enable_location': 'ਸਥਾਨ ਸਮਰੱਥ ਕਰੋ',
    'location_disabled': 'ਸਥਾਨ ਐਕਸੈਸ ਅਸਮਰੱਥ',

    // SMS/IVR
    'sms_submit': 'ਐਸਐਮਐਸ ਦੁਆਰਾ ਸਬਮਿਟ ਕਰੋ',
    'ivr_submit': 'ਆਈਵੀਆਰ ਦੁਆਰਾ ਸਬਮਿਟ ਕਰੋ',
    'phone_number': 'ਫੋਨ ਨੰਬਰ',
    'send_sms': 'ਐਸਐਮਐਸ ਭੇਜੋ',
    'call_ivr': 'ਆਈਵੀਆਰ ਨੰਬਰ ਤੇ ਕਾਲ ਕਰੋ',

    // Home page sections
    'top_stories': 'ਸਿਖਰਲੇ ਸਮਾਚਾਰ',
    'safe_verified': 'ਸੁਰੱਖਿਅਤ ਅਤੇ ਤਸਦੀਕ ਕੀਤਾ',
    'zero_tolerance': 'ਸਪੈਮ ਦੇ ਪ੍ਰਤੀ ਸਿਫ਼ਰ ਸਹਿਣਸ਼ੀਲਤਾ',
    'trending_topics': 'ਟ੍ਰੈਂਡਿੰਗ ਵਿਸ਼ੇ',
    'from_the_desk': 'ਡੈਸਕ ਤੋਂ',
    'grassroots_stories': 'ਗ੍ਰਾਸਰੂਟ ਕਹਾਣੀਆਂ ਵਧੀਆ ਫੈਸਲੇ ਲੈਂਦੀਆਂ ਹਨ। ਖੇਤਰ ਦੇ ਪਿੰਡਾਂ ਤੋਂ ਵਿਕਾਸ, ਮੁੱਦਿਆਂ ਅਤੇ ਸੱਭਿਆਚਾਰ ਦਾ ਪਤਾ ਲਗਾਓ—ਸਮੁਦਾਇ ਦੁਆਰਾ ਰਿਪੋਰਟ ਕੀਤਾ ਗਿਆ।',
    'most_read': 'ਸਭ ਤੋਂ ਵੱਧ ਪੜ੍ਹਿਆ ਗਿਆ',
    'regional_highlights': 'ਖੇਤਰੀ ਹਾਈਲਾਈਟਸ',
    'weekly_brief': 'ਹਫ਼ਤਾਵਾਰੀ ਸੰਖੇਪ',
    'newsletter_sub': 'ਸਿਖਰਲੇ ਸਮਾਚਾਰ ਅਤੇ ਪਿੰਡੀ ਗਿਆਨ ਤੁਹਾਡੇ ਇਨਬਾਕਸ ਵਿੱਚ।',
    'subscribe': 'ਸਬਸਕ੍ਰਾਈਬ ਕਰੋ',
    'translated': 'ਅਨੁਵਾਦਿਤ',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] ||
           translations.en[key as keyof typeof translations.en] ||
           key;
  };

  const translateContent = async (text: string): Promise<string> => {
    // Translation is now handled by the backend API
    // This function is kept for compatibility but no longer used
    return text;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      translateContent
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
