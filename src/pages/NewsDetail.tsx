import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { NewsArticle } from '../types';
import { MapPin, Calendar, User, Eye, ArrowLeft, FileText, Tag, MapPin as MapPinIcon } from 'lucide-react';
import apiService from '../services/api';

// Mock data
const mockArticle: NewsArticle = {
  id: '1',
  title: 'New Water Supply Scheme Launched in Village Panchayat',
  content: `The government has launched a comprehensive water supply scheme that will benefit over 500 households in the village panchayat. This initiative, part of the Jal Jeevan Mission, includes installation of new water tanks, pipeline network, and water treatment facilities.

The scheme was inaugurated by the District Collector in a ceremony attended by local officials, village representatives, and community members. The project is expected to be completed within 6 months and will provide 24x7 clean drinking water to all households.

Key features of the scheme:
- Installation of 2 new water storage tanks with 50,000 liter capacity each
- 5 km of new pipeline network connecting all households
- Water treatment plant with modern filtration system
- Regular water quality monitoring
- Community awareness programs on water conservation

The total cost of the project is ₹2.5 crores, with 60% funding from the central government and 40% from the state government. Local villagers have also contributed through voluntary labor and community participation.

"This scheme will significantly improve the quality of life in our village," said Sarpanch Ram Singh. "We are grateful to the government for this initiative and will ensure its proper maintenance."

The implementation is being monitored by a committee comprising village representatives, government officials, and technical experts. Regular progress reports will be shared with the community through village meetings and digital platforms.`,
  category: 'scheme',
  village: 'Village A',
  author: 'Ram Singh',
  publishedAt: '2024-01-15T10:30:00Z',
  status: 'published',
  location: { latitude: 30.7333, longitude: 76.7794 },
  tags: ['water', 'government', 'infrastructure', 'development'],
  viewCount: 245,
  isGeoTagged: true
};

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await apiService.getNewsById(id);
        setArticle(response.news);
      } catch (error) {
        console.error('Failed to fetch article:', error);
        setError('Failed to load article');
        // Fallback to mock data
        setArticle(mockArticle);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryGradient = (category: string) => {
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

  if (loading) {
    return (
      <div className="news-detail-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-not-found">
        <div className="not-found-card">
          <div className="not-found-icon">
            <FileText size={48} />
          </div>
          <h2 className="not-found-title">{error || t('article_not_found')}</h2>
          <p className="not-found-message">{t('article_not_found_message')}</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            {t('back_to_news')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      <div className="detail-container">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          {t('back_to_news')}
        </Link>

        <article className="article-card">
          <header className="article-header">
            <div className="article-badges">
              <span 
                className="category-badge"
                style={{
                  background: getCategoryGradient(article.category)
                }}
              >
                {t(article.category)}
              </span>
              {article.isGeoTagged && (
                <span className="geo-badge">
                  <MapPin size={14} />
                  {t('geo_tagged')}
                </span>
              )}
            </div>

            <h1 className="article-title">
              {article.title}
            </h1>

            <div className="article-meta">
              <div className="meta-item">
                <User size={16} />
                <span>{typeof article.author === 'object' && article.author ? article.author.name : article.author}</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="meta-item">
                <Eye size={16} />
                <span>{article.viewCount} {t('views')}</span>
              </div>
              <div className="meta-item">
                <MapPinIcon size={16} />
                <span>{article.village}</span>
              </div>
            </div>
          </header>

          {article.images && article.images.length > 0 && (
            <div className="article-images">
              {article.images.map((image, index) => (
                <div key={index} className="article-image-container">
                  <img
                    src={`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${image.url}`}
                    alt={image.alt || `Image ${index + 1}`}
                    className="article-image"
                  />
                  {image.caption && (
                    <p className="image-caption">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="article-content">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="content-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          {article.location && (
            <div className="article-location">
              <h4 className="location-title">
                <MapPin size={16} />
                {t('location')}
              </h4>
              <p className="location-coordinates">
                {article.location.latitude.toFixed(6)}, {article.location.longitude.toFixed(6)}
              </p>
            </div>
          )}

          {article.tags.length > 0 && (
            <div className="article-tags">
              <h4 className="tags-title">
                <Tag size={16} />
                {t('tags')}
              </h4>
              <div className="tags-container">
                {article.tags.map((tag) => (
                  <span key={tag} className="tag-item">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Articles */}
        <div className="related-articles">
          <h3 className="related-title">{t('related_articles')}</h3>
          <div className="empty-related">
            <div className="empty-icon">📰</div>
            <p>{t('no_related_articles')}</p>
          </div>
        </div>
      </div>

      <style>{`
        .news-detail-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .detail-container {
          background: var(--background-primary);
          border-radius: 24px;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary-color);
          text-decoration: none;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          background: var(--background-secondary);
          border: 1px solid var(--border-light);
        }

        .back-link:hover {
          background: var(--primary-color);
          color: white;
          transform: translateX(-4px);
        }

        .article-card {
          padding: 3rem;
          background: var(--background-primary);
          border-radius: 24px;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-color);
          backdrop-filter: blur(10px);
        }

        .article-header {
          margin-bottom: 2.5rem;
        }

        .article-badges {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .category-badge {
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

        .geo-badge {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--primary-color);
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.4rem 0.8rem;
          background: rgba(30, 58, 138, 0.1);
          border-radius: 16px;
          border: 1px solid rgba(30, 58, 138, 0.2);
          backdrop-filter: blur(10px);
        }

        .article-title {
          font-size: 2.75rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          color: var(--text-primary);
          letter-spacing: -0.05em;
          background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary-color) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .article-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-light);
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .article-content {
          line-height: 1.9;
          font-size: 1.125rem;
          color: var(--text-primary);
          margin-bottom: 2.5rem;
          font-weight: 400;
        }

        .content-paragraph {
          margin-bottom: 1.5rem;
          text-align: justify;
        }

        .content-paragraph:last-child {
          margin-bottom: 0;
        }

        .article-images {
          margin-bottom: 2.5rem;
          display: grid;
          gap: 1.5rem;
        }

        .article-image-container {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          background: var(--background-primary);
          border: 1px solid var(--border-light);
        }

        .article-image {
          width: 100%;
          height: auto;
          max-height: 500px;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .article-image:hover {
          transform: scale(1.02);
        }

        .image-caption {
          margin: 0;
          padding: 1rem;
          background: var(--background-secondary);
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-style: italic;
          border-top: 1px solid var(--border-light);
        }

        .article-location {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--background-secondary);
          border-radius: 16px;
          border: 1px solid var(--border-light);
        }

        .location-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .location-coordinates {
          margin: 0;
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        .article-tags {
          padding-top: 2rem;
          border-top: 1px solid var(--border-light);
        }

        .tags-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .tag-item {
          background: var(--gradient-accent);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          box-shadow: var(--shadow-sm);
        }

        .related-articles {
          margin-top: 2rem;
        }

        .related-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }

        .empty-related {
          text-align: center;
          padding: 3rem 2rem;
          background: var(--background-secondary);
          border-radius: 16px;
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .article-not-found {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--gradient-hero);
        }

        .not-found-card {
          background: var(--background-primary);
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          box-shadow: var(--shadow-xl);
          max-width: 400px;
          width: 100%;
        }

        .not-found-icon {
          width: 80px;
          height: 80px;
          background: var(--gradient-primary);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
        }

        .not-found-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .not-found-message {
          color: var(--text-secondary);
          font-size: 1rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .news-detail-page {
            padding: 1rem;
          }
          
          .article-card {
            padding: 2rem;
            margin: 0.5rem;
            border-radius: 20px;
          }
          
          .article-title {
            font-size: 2rem;
            line-height: 1.2;
          }
          
          .article-meta {
            flex-direction: column;
            gap: 1rem;
          }
          
          .article-content {
            font-size: 1rem;
            line-height: 1.7;
          }
        }

        @media (max-width: 480px) {
          .article-title {
            font-size: 1.75rem;
          }
          
          .article-badges {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .tags-container {
            flex-direction: column;
          }
          
          .tag-item {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsDetail;
