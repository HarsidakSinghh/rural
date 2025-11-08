import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContextFree';
import { useAuth } from '../contexts/AuthContext';
import { NewsSubmission, AdminStats } from '../types';
import { Eye, Check, X, Edit, Trash2, BarChart3, Shield, Users, FileText, AlertCircle, TrendingUp, MapPin, Tag } from 'lucide-react';
import apiService from '../services/api';



const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'pending' | 'published' | 'rejected'>('overview');
  const [submissions, setSubmissions] = useState<NewsSubmission[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalSubmissions: 0,
    pendingReviews: 0,
    publishedArticles: 0,
    rejectedArticles: 0,
    totalVillages: 0,
    activeReporters: 0,
    monthlyStats: {
      month: '',
      submissions: 0,
      published: 0,
      rejected: 0,
      views: 0,
      newUsers: 0
    },
    dailyStats: [],
    topVillages: [],
    categoryBreakdown: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, submissionsResponse] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getAllSubmissions()
        ]);

        setStats(statsResponse);
        setSubmissions(submissionsResponse.submissions || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Keep empty state (0 values) when API fails
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <div className="access-denied-card">
          <div className="access-denied-icon">
            <Shield size={48} />
          </div>
          <h2 className="access-denied-title">{t('access_denied')}</h2>
          <p className="access-denied-message">{t('admin_access_required')}</p>
        </div>
      </div>
    );
  }

  const handleApprove = async (id: string) => {
    try {
      await apiService.approveNews(id);
      setSubmissions(submissions.map(sub => 
        sub.id === id ? { ...sub, status: 'approved' as const } : sub
      ));
    } catch (error) {
      console.error('Failed to approve news:', error);
      alert('Failed to approve news');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    try {
      await apiService.rejectNews(id, reason);
      setSubmissions(submissions.map(sub => 
        sub.id === id ? { ...sub, status: 'rejected' as const, adminNotes: reason } : sub
      ));
    } catch (error) {
      console.error('Failed to reject news:', error);
      alert('Failed to reject news');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this news article? This action cannot be undone.')) {
      return;
    }

    try {
      await apiService.adminDeleteNews(id);
      setSubmissions(submissions.filter(sub => sub.id !== id));
      alert('News article deleted successfully');
    } catch (error) {
      console.error('Failed to delete news:', error);
      alert('Failed to delete news article. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'pending': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'approved': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'rejected': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (activeTab === 'overview') return true;
    return sub.status === activeTab;
  });

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-icon">
            <Shield size={32} />
          </div>
          <div>
            <h2 className="admin-title">{t('admin_dashboard')}</h2>
            <p className="admin-subtitle">{t('manage_news_submissions')}</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="admin-stats">
        <div className="stat-item">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-number">{stats.totalSubmissions}</div>
          <div className="stat-label">{t('total_submissions')}</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-number">{stats.pendingReviews}</div>
          <div className="stat-label">{t('pending_reviews')}</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <Check size={24} />
          </div>
          <div className="stat-number">{stats.publishedArticles}</div>
          <div className="stat-label">{t('published')}</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <X size={24} />
          </div>
          <div className="stat-number">{stats.rejectedArticles}</div>
          <div className="stat-label">{t('rejected')}</div>
        </div>
      </div>

      {/* Monthly Analytics */}
      <div className="analytics-section">
        <h3 className="analytics-title">
          <BarChart3 size={20} />
          {t('monthly_analytics')} - {stats.monthlyStats.month}
        </h3>
        <div className="monthly-stats">
          <div className="monthly-stat">
            <div className="monthly-number">{stats.monthlyStats.submissions}</div>
            <div className="monthly-label">{t('submissions')}</div>
          </div>
          <div className="monthly-stat">
            <div className="monthly-number">{stats.monthlyStats.published}</div>
            <div className="monthly-label">{t('published')}</div>
          </div>
          <div className="monthly-stat">
            <div className="monthly-number">{stats.monthlyStats.views}</div>
            <div className="monthly-label">{t('total_views')}</div>
          </div>
          <div className="monthly-stat">
            <div className="monthly-number">{stats.monthlyStats.newUsers}</div>
            <div className="monthly-label">{t('new_users')}</div>
          </div>
        </div>
      </div>

      {/* Daily Stats Chart */}
      <div className="daily-stats-section">
        <h3 className="section-title">
          <TrendingUp size={20} />
          {t('daily_activity')}
        </h3>
        <div className="daily-stats-chart">
          {stats.dailyStats.map((day, index) => (
            <div key={day.date} className="daily-stat-bar">
              <div className="bar-container">
                <div 
                  className="bar submissions-bar"
                  style={{ height: `${(day.submissions / 10) * 100}%` }}
                />
                <div 
                  className="bar published-bar"
                  style={{ height: `${(day.published / 10) * 100}%` }}
                />
                <div 
                  className="bar views-bar"
                  style={{ height: `${(day.views / 200) * 100}%` }}
                />
              </div>
              <div className="bar-label">
                {new Date(day.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
              <div className="bar-values">
                <span className="value submissions">{day.submissions}</span>
                <span className="value published">{day.published}</span>
                <span className="value views">{day.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Villages */}
      <div className="top-villages-section">
        <h3 className="section-title">
          <MapPin size={20} />
          {t('top_villages')}
        </h3>
        <div className="villages-list">
          {stats.topVillages.map((village, index) => (
            <div key={village.village} className="village-item">
              <div className="village-rank">#{index + 1}</div>
              <div className="village-info">
                <div className="village-name">{village.village}</div>
                <div className="village-stats">
                  <span className="village-stat">
                    <FileText size={14} />
                    {village.submissions} {t('submissions')}
                  </span>
                  <span className="village-stat">
                    <Check size={14} />
                    {village.published} {t('published')}
                  </span>
                  <span className="village-stat">
                    <Eye size={14} />
                    {village.views} {t('views')}
                  </span>
                  <span className="village-stat">
                    <Users size={14} />
                    {village.reporters} {t('reporters')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="category-breakdown-section">
        <h3 className="section-title">
          <Tag size={20} />
          {t('category_breakdown')}
        </h3>
        <div className="category-stats">
          {stats.categoryBreakdown.map((category) => (
            <div key={category.category} className="category-item">
              <div className="category-header">
                <span className="category-name">{t(category.category)}</span>
                <span className="category-percentage">{category.percentage}%</span>
              </div>
              <div className="category-bar">
                <div 
                  className="category-fill"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
              <div className="category-details">
                <span className="category-count">{category.count} {t('articles')}</span>
                <span className="category-views">{category.views} {t('views')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={16} />
          {t('overview')}
        </button>
        <button
          className={`nav-tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <AlertCircle size={16} />
          {t('pending_reviews')} ({stats.pendingReviews})
        </button>
        <button
          className={`nav-tab ${activeTab === 'published' ? 'active' : ''}`}
          onClick={() => setActiveTab('published')}
        >
          <Check size={16} />
          {t('published')} ({stats.publishedArticles})
        </button>
        <button
          className={`nav-tab ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          <X size={16} />
          {t('rejected')} ({stats.rejectedArticles})
        </button>
      </div>

      {/* Submissions List */}
      <div className="submissions-list">
        {filteredSubmissions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>{t('no_submissions_found')}</h3>
            <p>{t('no_submissions_for_filter')}</p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <div key={submission.id} className="card submission-item">
              <div className="submission-header">
                <div className="submission-info">
                  <h3 className="submission-title">
                    {submission.title}
                  </h3>
                  <div className="submission-meta">
                    <span className="meta-item">
                      <Users size={14} />
                      <strong>{t('author')}:</strong> {submission.authorName}
                    </span>
                    <span className="meta-item">
                      <FileText size={14} />
                      <strong>{t('village')}:</strong> {submission.village}
                    </span>
                    <span className="meta-item">
                      <strong>{t('category')}:</strong> {t(submission.category)}
                    </span>
                  </div>
                </div>
                <span
                  className="status-badge"
                  style={{
                    background: getStatusGradient(submission.status)
                  }}
                >
                  {t(submission.status)}
                </span>
              </div>

              <div className="submission-content">
                {submission.content.length > 200 
                  ? `${submission.content.substring(0, 200)}...` 
                  : submission.content
                }
              </div>

              <div className="submission-footer">
                <div className="submission-details">
                  <span className="detail-item">
                    📅 {formatDate(submission.submittedAt)}
                  </span>
                  <span className="detail-item">
                    📞 {submission.authorPhone}
                  </span>
                </div>
              </div>

              {submission.adminNotes && (
                <div className="admin-notes">
                  <strong>{t('admin_notes')}:</strong> {submission.adminNotes}
                </div>
              )}

              <div className="submission-actions">
                <button
                  onClick={() => window.open(`/news/${submission.id}`, '_blank')}
                  className="btn btn-secondary action-btn"
                >
                  <Eye size={16} />
                  {t('view')}
                </button>
                
                {submission.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleApprove(submission.id)}
                      className="btn btn-success action-btn"
                    >
                      <Check size={16} />
                      {t('approve')}
                    </button>
                    <button 
                      onClick={() => handleReject(submission.id)}
                      className="btn btn-danger action-btn"
                    >
                      <X size={16} />
                      {t('reject')}
                    </button>
                  </>
                )}
                
                <button className="btn btn-secondary action-btn">
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(submission.id)}
                  className="btn btn-danger action-btn"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .admin-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .admin-header {
          background: var(--gradient-hero);
          color: white;
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .admin-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.3;
        }

        .admin-header-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-icon {
          width: 64px;
          height: 64px;
          background: rgba(255,255,255,0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .admin-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
          letter-spacing: -0.025em;
        }

        .admin-subtitle {
          opacity: 0.9;
          font-size: 1rem;
          font-weight: 400;
        }

        .admin-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-item {
          background: var(--background-primary);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-light);
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-primary);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .stat-item:hover::before {
          transform: scaleX(1);
        }

        .stat-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: var(--gradient-primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: white;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .nav-tabs {
          display: flex;
          background: var(--background-primary);
          border-radius: 16px;
          padding: 0.5rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-light);
          overflow-x: auto;
        }

        .nav-tab {
          flex: 1;
          padding: 1rem;
          text-align: center;
          background: none;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          white-space: nowrap;
          min-width: 120px;
        }

        .nav-tab.active {
          background: var(--gradient-primary);
          color: white;
          box-shadow: var(--shadow-md);
        }

        .nav-tab:hover:not(.active) {
          background: var(--background-secondary);
          color: var(--text-primary);
        }

        .submissions-list {
          display: grid;
          gap: 1.5rem;
        }

        .submission-item {
          position: relative;
          overflow: hidden;
        }

        .submission-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .submission-info {
          flex: 1;
        }

        .submission-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .submission-meta {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .status-badge {
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: var(--shadow-sm);
        }

        .submission-content {
          background: var(--background-secondary);
          padding: 1.5rem;
          border-radius: 12px;
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          border: 1px solid var(--border-light);
        }

        .submission-footer {
          margin-bottom: 1rem;
        }

        .submission-details {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .detail-item {
          font-size: 0.875rem;
          color: var(--text-light);
        }

        .admin-notes {
          padding: 1rem;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 1px solid #f59e0b;
          border-radius: 12px;
          font-size: 0.9rem;
          color: #92400e;
          margin-bottom: 1.5rem;
        }

        .submission-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          min-width: auto;
          flex: 1;
          justify-content: center;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .admin-access-denied {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--gradient-hero);
        }

        .access-denied-card {
          background: var(--background-primary);
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          box-shadow: var(--shadow-xl);
          max-width: 400px;
          width: 100%;
        }

        .access-denied-icon {
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

        .access-denied-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .access-denied-message {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .admin-dashboard {
            padding: 1rem;
          }
          
          .admin-header {
            padding: 1.5rem;
          }
          
          .admin-title {
            font-size: 1.5rem;
          }
          
          .admin-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .nav-tabs {
            flex-direction: column;
          }
          
          .nav-tab {
            min-width: auto;
          }
          
          .submission-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .submission-actions {
            flex-direction: column;
          }
        }

        .analytics-section {
          background: var(--background-primary);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-light);
          margin-bottom: 2rem;
        }

        .analytics-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--primary-color);
        }

        .monthly-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
        }

        .monthly-stat {
          text-align: center;
          padding: 1.5rem;
          background: var(--background-secondary);
          border-radius: 16px;
          border: 1px solid var(--border-light);
          transition: all 0.3s ease;
        }

        .monthly-stat:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .monthly-number {
          font-size: 2.5rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .monthly-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .daily-stats-section {
          background: var(--background-primary);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-light);
          margin-bottom: 2rem;
        }

        .daily-stats-chart {
          display: flex;
          gap: 1rem;
          align-items: end;
          height: 200px;
          padding: 1rem 0;
        }

        .daily-stat-bar {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .bar-container {
          height: 120px;
          width: 100%;
          display: flex;
          align-items: end;
          gap: 2px;
          margin-bottom: 0.5rem;
        }

        .bar {
          flex: 1;
          border-radius: 4px 4px 0 0;
          min-height: 4px;
        }

        .submissions-bar {
          background: var(--gradient-primary);
        }

        .published-bar {
          background: var(--gradient-accent);
        }

        .views-bar {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .bar-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .bar-values {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: var(--text-light);
        }

        .top-villages-section {
          background: var(--background-primary);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-light);
          margin-bottom: 2rem;
        }

        .villages-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .village-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--background-secondary);
          border-radius: 16px;
          border: 1px solid var(--border-light);
          transition: all 0.3s ease;
        }

        .village-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .village-rank {
          width: 40px;
          height: 40px;
          background: var(--gradient-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .village-info {
          flex: 1;
        }

        .village-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .village-stats {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .village-stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .category-breakdown-section {
          background: var(--background-primary);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-light);
          margin-bottom: 2rem;
        }

        .category-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .category-item {
          padding: 1.5rem;
          background: var(--background-secondary);
          border-radius: 16px;
          border: 1px solid var(--border-light);
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .category-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          text-transform: capitalize;
        }

        .category-percentage {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .category-bar {
          width: 100%;
          height: 8px;
          background: var(--background-primary);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .category-fill {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .category-details {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .monthly-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .daily-stats-chart {
            flex-direction: column;
            height: auto;
            gap: 0.5rem;
          }
          
          .daily-stat-bar {
            flex-direction: row;
            align-items: center;
            gap: 1rem;
          }
          
          .bar-container {
            height: 20px;
            width: 100px;
            flex-direction: row;
          }
          
          .village-stats {
            flex-direction: column;
            gap: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .admin-stats {
            grid-template-columns: 1fr;
          }
          
          .monthly-stats {
            grid-template-columns: 1fr;
          }
          
          .submission-header {
            flex-direction: column;
            gap: 1rem;
          }
          
          .status-badge {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
