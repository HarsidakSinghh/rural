import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContextFree';
import { NewsArticle, NewsCategory } from '../types';
import { MapPin, Calendar, User, Eye, TrendingUp, Newspaper, Users, Award } from 'lucide-react';
import apiService from '../services/api';
import './Home.css';

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
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [animateCards, setAnimateCards] = useState(false);


  const categories: Array<{ value: NewsCategory | 'all'; label: string; icon: React.ReactNode }> = [
    { value: 'all', label: t('latest_news'), icon: <TrendingUp size={18} /> },
    { value: 'news', label: t('news'), icon: <Newspaper size={18} /> },
    { value: 'scheme', label: t('scheme'), icon: <Award size={18} /> },
    { value: 'culture', label: t('culture'), icon: <Users size={18} /> },
    { value: 'issue', label: t('issue'), icon: <MapPin size={18} /> },
    { value: 'event', label: t('event'), icon: <Calendar size={18} /> },
    { value: 'agriculture', label: t('agriculture'), icon: <MapPin size={18} /> },
    { value: 'education', label: t('education'), icon: <Users size={18} /> },
    { value: 'health', label: t('health'), icon: <Award size={18} /> },
    { value: 'infrastructure', label: t('infrastructure'), icon: <MapPin size={18} /> },
    { value: 'other', label: t('other'), icon: <Newspaper size={18} /> }
  ];

  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter(article => article.category === selectedCategory);

  // Fetch news from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const filters = language !== 'en' ? { lang: language } : {};
        const response = await apiService.getNews(filters);
        setNews(response.news || []);
      } catch (error) {
        console.error('Failed to fetch news:', error);
        // Fallback to mock data if API fails
        setNews(mockNews);
      } finally {
        setLoading(false);
        // Trigger card animations after data loads
        const timer = setTimeout(() => setAnimateCards(true), 100);
        return () => clearTimeout(timer);
      }
    };

    fetchNews();
  }, [language]);



  // Filter news when category changes
  useEffect(() => {
    setAnimateCards(false);
    const timer = setTimeout(() => setAnimateCards(true), 100);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryGradient = (category: NewsCategory) => {
    switch (category) {
      case 'scheme': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'culture': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'issue': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'event': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'news': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      case 'agriculture': return 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
      case 'education': return 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)';
      case 'health': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'infrastructure': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      case 'other': return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  };

  // Derived UI-only data: topic frequencies for chip cloud
  const topicFrequencies = React.useMemo(() => {
    const freq: Record<string, number> = {};
    (news || []).forEach(a => {
      (a.tags || []).forEach(tag => {
        const key = String(tag).toLowerCase();
        freq[key] = (freq[key] || 0) + 1;
      });
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
  }, [news]);

  // Most read list (top by view count)
  const mostRead = React.useMemo(() => {
    return [...(news || [])]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5);
  }, [news]);

  // Regional highlights (by village)
  const villageStats = React.useMemo(() => {
    const map: Record<string, number> = {};
    (news || []).forEach(a => {
      if (!a.village) return;
      map[a.village] = (map[a.village] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [news]);

  return (
    <div className="home-page">
      {/* Top Strip: Headlines ticker and quick stats */}
      <div className="top-strip">
        <div className="ticker-row">
          <div className="ticker-heading">{t('top_stories')}</div>
          <div className="headline-ticker">
            <div className="ticker-content">
              {(filteredNews.length ? filteredNews : news).slice(0, 5).map((article, i) => {
                return (
                  <span key={article.id || i} className="ticker-item">
                    {article.title}
                  </span>
                );
              })}
              {/* Duplicate for seamless loop */}
              {(filteredNews.length ? filteredNews : news).slice(0, 5).map((article, i) => {
                return (
                  <span key={`${article.id || i}-dup`} className="ticker-item">
                    {article.title}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="info-strip">
          <div className="info-item">📰 {news.length}</div>
          <div className="info-item">📍 {news.filter(a => a.isGeoTagged).length}</div>
          <div className="info-item">🏷️ {new Set(news.map(a => a.category)).size}</div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">🕒</div>
          <div className="stat-text">
            <div className="stat-title">{t('latest_news')}</div>
            <div className="stat-sub">{filteredNews.length || news.length} {t('news')}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌾</div>
          <div className="stat-text">
            <div className="stat-title">{t('community_news_platform')}</div>
            <div className="stat-sub">{t('contribute_to_community')}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔒</div>
          <div className="stat-text">
            <div className="stat-title">{t('safe_verified')}</div>
            <div className="stat-sub">{t('zero_tolerance')}</div>
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
    <div className="empty-state">
      <div className="empty-icon">📰</div>
      <h3>{t('no_news_found')}</h3>
      <p>{t('try_different_category')}</p>
    </div>
  ) : (
    <div className="news-grid">
      {filteredNews.map((article, index) => {
        const displayTitle = article.title;
        const displayContent = article.content;

        return (
          <Link
            key={article.id || index}
            to={`/news/${article.id}`}
            className={`news-link ${animateCards ? 'animate' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="news-item">

              {/* Category Badge */}
              <div className="category-badge">
                <span
                  className="category-tag"
                  style={{ background: getCategoryGradient(article.category) }}
                >
                  {t(article.category)}
                </span>
              </div>



              {/* Content */}
              <div className="news-content">
                <h3 className="news-title">{displayTitle}</h3>
                <p className="news-excerpt">
                  {displayContent.length > 150
                    ? `${displayContent.substring(0, 150)}...`
                    : displayContent}
                </p>

                {/* Meta Information */}
                <div className="news-meta">
                  <div className="meta-item">
                    <User size={14} />
                    <span>
                      {typeof article.author === 'object' && article.author
                        ? (article.author.name || 'Unknown Author')
                        : (typeof article.author === 'string' ? article.author : 'Unknown Author')
                      }
                    </span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="news-footer">
                <span className="village-name">📍 {article.village}</span>
                <div className="view-count">
                  <Eye size={14} />
                  <span>{article.viewCount}</span>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="news-hover-overlay" />
            </div>
          </Link>
        );
      })}
    </div>
  )}
</div>


      {/* Topics Cloud */}
      {topicFrequencies.length > 0 && (
        <div className="topics-cloud">
          <div className="topics-header">{t('trending_topics')}</div>
          <div className="topics-list">
            {topicFrequencies.map(([topic, count]) => (
              <span key={topic} className="topic-chip">
                #{topic} <span className="topic-count">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Editorial Note */}
      <div className="editorial-note">
        <div className="editorial-title">{t('from_the_desk')}</div>
        <p className="editorial-text">
          {t('grassroots_stories')}
        </p>
      </div>

      {/* Most Read */}
      {mostRead.length > 0 && (
        <div className="most-read">
          <div className="most-read-header">{t('most_read')}</div>
          <ol className="most-read-list">
            {mostRead.map((article, idx) => {
              return (
                <li key={article.id || idx} className="most-read-item">
                  <Link to={`/news/${article.id}`} className="most-read-link">
                    <span className="most-read-rank">{idx + 1}</span>
                    <span className="most-read-title">
                      {article.title}
                    </span>
                    <span className="most-read-views">{article.viewCount}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Regional Highlights */}
      {villageStats.length > 0 && (
        <div className="regional-highlights">
          <div className="regional-header">{t('regional_highlights')}</div>
          <div className="regional-list">
            {villageStats.map(([village, count]) => (
              <span key={village} className="region-chip">
                📍 {village}
                <span className="region-count">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter CTA (non-functional) */}
      <div className="newsletter-card">
        <div className="newsletter-title">{t('weekly_brief')}</div>
        <div className="newsletter-sub">{t('newsletter_sub')}</div>
        <div className="newsletter-actions">
          <input className="newsletter-input" placeholder="your@email" />
          <button className="btn btn-secondary">{t('subscribe')}</button>
        </div>
      </div>

      {/* Footer Info Bar */}
      <footer className="footer-bar" role="contentinfo">
        <div className="footer-links">
          <Link to="/about" className="footer-link">About</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
          <Link to="/privacy" className="footer-link">Privacy</Link>
          <Link to="/terms" className="footer-link">Terms</Link>
        </div>
        <div className="footer-meta">© {new Date().getFullYear()} GramPulse</div>
      </footer>

      {/* Submit News CTA */}
      <div className="cta-card">
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
    </div>
  );
};

export default Home;
