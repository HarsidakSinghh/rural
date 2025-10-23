import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { NewsArticle, NewsCategory } from '../types';
import { MapPin, Calendar, User, Eye, TrendingUp, Newspaper, Users, Award } from 'lucide-react';

// Mock data for demonstration
const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'New Water Supply Scheme Launched in Village Panchayat',
    content: 'The government has launched a new water supply scheme that will benefit over 500 households in the village panchayat. The scheme includes installation of new water tanks and pipeline network.',
    category: 'scheme',
    village: 'Village A',
    author: 'Ram Singh',
    publishedAt: '2024-01-15T10:30:00Z',
    status: 'published',
    location: { latitude: 30.7333, longitude: 76.7794 },
    tags: ['water', 'government', 'infrastructure'],
    viewCount: 245,
    isGeoTagged: true
  },
  {
    id: '2',
    title: 'Traditional Folk Dance Festival Celebrated',
    content: 'The annual folk dance festival was celebrated with great enthusiasm. Local artists performed traditional dances and songs, preserving our cultural heritage.',
    category: 'culture',
    village: 'Village B',
    author: 'Priya Sharma',
    publishedAt: '2024-01-14T16:45:00Z',
    status: 'published',
    tags: ['culture', 'festival', 'tradition'],
    viewCount: 189,
    isGeoTagged: false
  },
  {
    id: '3',
    title: 'Road Repair Work Begins on Main Village Road',
    content: 'The long-awaited road repair work has finally begun on the main village road. This will improve connectivity and reduce travel time for villagers.',
    category: 'issue',
    village: 'Village C',
    author: 'Amit Kumar',
    publishedAt: '2024-01-13T09:15:00Z',
    status: 'published',
    tags: ['road', 'infrastructure', 'development'],
    viewCount: 156,
    isGeoTagged: true
  },
  {
    id: '4',
    title: 'Digital Literacy Program for Rural Women',
    content: 'A new digital literacy program has been launched specifically for rural women, teaching them basic computer skills and smartphone usage.',
    category: 'news',
    village: 'Village D',
    author: 'Sunita Devi',
    publishedAt: '2024-01-12T14:20:00Z',
    status: 'published',
    tags: ['education', 'women', 'technology'],
    viewCount: 203,
    isGeoTagged: false
  },
  {
    id: '5',
    title: 'Annual Village Sports Meet Announced',
    content: 'The annual village sports meet will be held next month with competitions in kabaddi, wrestling, and traditional games.',
    category: 'event',
    village: 'Village E',
    author: 'Rajesh Kumar',
    publishedAt: '2024-01-11T11:30:00Z',
    status: 'published',
    tags: ['sports', 'community', 'event'],
    viewCount: 178,
    isGeoTagged: true
  }
];

const Home: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [news, setNews] = useState<NewsArticle[]>(mockNews);
  const [loading, setLoading] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  const categories: Array<{ value: NewsCategory | 'all'; label: string; icon: React.ReactNode }> = [
    { value: 'all', label: t('latest_news'), icon: <TrendingUp size={18} /> },
    { value: 'news', label: t('news'), icon: <Newspaper size={18} /> },
    { value: 'scheme', label: t('scheme'), icon: <Award size={18} /> },
    { value: 'culture', label: t('culture'), icon: <Users size={18} /> },
    { value: 'issue', label: t('issue'), icon: <MapPin size={18} /> },
    { value: 'event', label: t('event'), icon: <Calendar size={18} /> }
  ];

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(article => article.category === selectedCategory);

  useEffect(() => {
    // Trigger card animations after component mounts
    const timer = setTimeout(() => setAnimateCards(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: NewsCategory) => {
    switch (category) {
      case 'scheme': return '#10b981';
      case 'culture': return '#f59e0b';
      case 'issue': return '#ef4444';
      case 'event': return '#3b82f6';
      case 'news': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getCategoryGradient = (category: NewsCategory) => {
    switch (category) {
      case 'scheme': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'culture': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'issue': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'event': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'news': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background" />
        <div className="hero-content">
          <div className="hero-badge">
            <Award size={16} />
            <span>{t('trusted_platform')}</span>
          </div>
          <h1 className="hero-title">
            {t('welcome_to_gram_samachar')}
          </h1>
          <p className="hero-subtitle">
            {t('community_news_platform')}
          </p>
          <div className="hero-actions">
            <Link to="/submit" className="btn btn-primary hero-btn">
              <Newspaper size={20} />
              {t('submit_news')}
            </Link>
            <Link to="/register" className="btn btn-secondary hero-btn">
              <Users size={20} />
              {t('become_reporter')}
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <Newspaper size={24} />
              <div className="stat-content">
                <span className="stat-number">150+</span>
                <span className="stat-label">{t('news_articles')}</span>
              </div>
            </div>
            <div className="hero-stat">
              <Users size={24} />
              <div className="stat-content">
                <span className="stat-number">25+</span>
                <span className="stat-label">{t('villages')}</span>
              </div>
            </div>
            <div className="hero-stat">
              <Award size={24} />
              <div className="stat-content">
                <span className="stat-number">50+</span>
                <span className="stat-label">{t('reporters')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <div className="category-container">
          {categories.map((category, index) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`category-button ${selectedCategory === category.value ? 'active' : ''}`}
              style={{
                background: selectedCategory === category.value 
                  ? getCategoryGradient(category.value as NewsCategory)
                  : undefined
              }}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="news-list">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner" />
            {t('loading')}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">📰</div>
            <h3>{t('no_news_found')}</h3>
            <p>{t('try_different_category')}</p>
          </div>
        ) : (
          <div className="news-grid">
            {filteredNews.map((article, index) => (
              <Link 
                key={article.id} 
                to={`/news/${article.id}`}
                className={`news-link ${animateCards ? 'animate' : ''}`}
                style={{ 
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="card news-item">
                  {/* Category Badge */}
                  <div className="category-badge">
                    <span 
                      className="category-tag"
                      style={{
                        background: getCategoryGradient(article.category)
                      }}
                    >
                      {t(article.category)}
                    </span>
                  </div>

                  {/* Geo-tag indicator */}
                  {article.isGeoTagged && (
                    <div className="geo-tag">
                      <MapPin size={12} />
                      {t('geo_tagged')}
                    </div>
                  )}

                  {/* Content */}
                  <div className="news-content">
                    <h3 className="news-title">
                      {article.title}
                    </h3>
                    
                    <p className="news-excerpt">
                      {article.content.length > 150 
                        ? `${article.content.substring(0, 150)}...` 
                        : article.content
                      }
                    </p>
                    
                    {/* Meta Information */}
                    <div className="news-meta">
                      <div className="meta-item">
                        <User size={14} />
                        <span>{article.author}</span>
                      </div>
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="news-footer">
                      <span className="village-name">
                        📍 {article.village}
                      </span>
                      <div className="view-count">
                        <Eye size={14} />
                        <span>{article.viewCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="news-hover-overlay" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Submit News CTA */}
      <div className="card cta-card">
        <div className="cta-background" />
        <div className="cta-content">
          <h3 className="cta-title">
            {t('share_your_story')}
          </h3>
          <p className="cta-subtitle">
            {t('contribute_to_community')}
          </p>
          <Link to="/submit">
            <button className="btn btn-secondary">
              ✍️ {t('submit_news')}
            </button>
          </Link>
        </div>
      </div>

      {/* Additional CSS for new components */}
      <style>{`
        .home-page {
          min-height: 100vh;
        }

        .hero-section {
          background: var(--gradient-hero);
          color: white;
          padding: 3rem 1rem;
          margin-bottom: 2rem;
          border-radius: 0 0 24px 24px;
          position: relative;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.3;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          letter-spacing: -0.025em;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          font-weight: 400;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .hero-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .hero-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .hero-stat {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255,255,255,0.15);
          padding: 1.5rem 2rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }

        .hero-stat:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.2);
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 800;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .category-filter {
          margin-bottom: 2rem;
          padding: 0 1rem;
        }

        .category-container {
          display: flex;
          gap: 0.8rem;
          padding: 1.5rem;
          background: white;
          border-radius: 20px;
          box-shadow: var(--shadow-lg);
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .category-container::-webkit-scrollbar {
          display: none;
        }

        .category-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 16px;
          background: var(--background-secondary);
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: scale(1);
          box-shadow: var(--shadow-sm);
        }

        .category-button.active {
          color: white;
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        .category-button:hover:not(.active) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .news-list {
          padding: 0 1rem;
        }

        .news-grid {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          padding: 0 1rem;
        }

        .news-link {
          text-decoration: none;
          color: inherit;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .news-link.animate {
          opacity: 1;
          transform: translateY(0);
        }

        .news-item {
          position: relative;
          padding: 2rem;
          background: var(--background-primary);
          border-radius: 24px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }
        
        .news-item:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border-color: var(--primary-color);
        }

        .category-badge {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 2;
        }

        .category-tag {
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
        }

        .geo-tag {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: rgba(30, 58, 138, 0.1);
          color: var(--primary-color);
          padding: 0.4rem 0.8rem;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(30, 58, 138, 0.2);
        }

        .news-content {
          margin-top: 1rem;
        }

        .news-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: var(--text-primary);
          line-height: 1.3;
          letter-spacing: -0.025em;
        }

        .news-excerpt {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .news-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--border-light);
          font-size: 0.875rem;
          color: var(--text-light);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .news-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-light);
        }

        .village-name {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .view-count {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: var(--background-secondary);
          padding: 0.4rem 0.8rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .news-hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 16px;
          pointer-events: none;
        }

        .news-item:hover .news-hover-overlay {
          opacity: 1;
        }

        .empty-state {
          text-align: center;
          color: var(--text-secondary);
          padding: 3rem 2rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .cta-card {
          background: var(--gradient-hero);
          color: white;
          text-align: center;
          margin: 3rem 1rem;
          padding: 3rem 2rem;
          border-radius: 24px;
          box-shadow: 0 12px 40px rgba(30, 58, 138, 0.3);
          position: relative;
          overflow: hidden;
        }

        .cta-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.3;
        }

        .cta-content {
          position: relative;
          z-index: 1;
        }

        .cta-title {
          margin-bottom: 1rem;
          font-size: 1.75rem;
          font-weight: 700;
        }

        .cta-subtitle {
          margin-bottom: 2rem;
          opacity: 0.9;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .cta-card .btn {
          background: rgba(255,255,255,0.2);
          border: 2px solid white;
          color: white;
          padding: 1rem 2rem;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .cta-card .btn:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.2);
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 3rem;
          }
          
          .hero-subtitle {
            font-size: 1.5rem;
          }
          
          .news-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .news-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 3rem;
          }
        }

        @media (max-width: 768px) {
          .news-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 0 0.5rem;
          }
          
          .news-item {
            padding: 1.5rem;
          }
          
          .news-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
