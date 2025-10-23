import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile, UserStats, UserActivity } from '../types';
import { User, Mail, Phone, MapPin, Calendar, Eye, FileText, TrendingUp, Award, Shield, Activity, BarChart3, Clock, X } from 'lucide-react';

// Mock data for demonstration
const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Ram Singh',
  email: 'ram.singh@example.com',
  phone: '9876543210',
  village: 'Village A',
  role: 'reporter',
  joinedAt: '2023-06-15T10:30:00Z',
  lastActive: '2024-01-15T14:20:00Z',
  avatar: undefined,
  bio: 'Passionate about bringing local news to our community. Focused on development and cultural stories.',
  isTrusted: true,
  trustLevel: 'trusted',
  stats: {
    totalSubmissions: 25,
    approvedSubmissions: 22,
    rejectedSubmissions: 2,
    pendingSubmissions: 1,
    totalViews: 1847,
    thisMonthSubmissions: 8,
    lastMonthSubmissions: 6,
    averageViewsPerArticle: 84,
    topCategory: 'scheme',
    recentActivity: [
      {
        id: '1',
        type: 'submission',
        title: 'New Water Supply Scheme Launched',
        timestamp: '2024-01-15T10:30:00Z',
        status: 'approved'
      },
      {
        id: '2',
        type: 'approval',
        title: 'Traditional Dance Festival',
        timestamp: '2024-01-14T16:45:00Z',
        status: 'approved'
      },
      {
        id: '3',
        type: 'view',
        title: 'Road Repair Work Begins',
        timestamp: '2024-01-14T09:15:00Z'
      }
    ]
  }
};

const UserProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'stats'>('overview');

  // Update profile based on logged-in user
  useEffect(() => {
    if (user) {
      setProfile({
        ...mockUserProfile,
        id: user.id,
        name: user.name,
        email: user.email || '',
        phone: user.phone || '',
        village: user.village || '',
        role: user.role as 'admin' | 'reporter',
        isTrusted: user.isTrusted || false,
        stats: {
          ...mockUserProfile.stats,
          approvedSubmissions: user.approvedSubmissions || 0
        }
      });
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const getTrustLevelGradient = (level: string) => {
    switch (level) {
      case 'new': return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
      case 'trusted': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'verified': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission': return <FileText size={16} />;
      case 'approval': return <Award size={16} />;
      case 'rejection': return <X size={16} />;
      case 'view': return <Eye size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'submission': return '#3b82f6';
      case 'approval': return '#10b981';
      case 'rejection': return '#ef4444';
      case 'view': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <div className="profile-background" />
        <div className="profile-content">
          <div className="profile-avatar">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} />
            ) : (
              <div className="avatar-placeholder">
                <User size={32} />
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-role">{t(profile.role)}</p>
            <div className="profile-badges">
              <span 
                className="trust-badge"
                style={{
                  background: getTrustLevelGradient(profile.trustLevel)
                }}
              >
                <Shield size={14} />
                {t(profile.trustLevel)}
              </span>
              {profile.isTrusted && (
                <span className="trusted-badge">
                  <Award size={14} />
                  {t('trusted_user')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <User size={16} />
          {t('overview')}
        </button>
        <button
          className={`profile-tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <Activity size={16} />
          {t('activity')}
        </button>
        <button
          className={`profile-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart3 size={16} />
          {t('statistics')}
        </button>
      </div>

      <div className="profile-content-area">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="profile-details">
              <h3 className="section-title">
                <User size={20} />
                {t('profile_details')}
              </h3>
              <div className="details-grid">
                <div className="detail-item">
                  <Mail size={16} />
                  <div>
                    <span className="detail-label">{t('email')}</span>
                    <span className="detail-value">{profile.email || t('not_provided')}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <div>
                    <span className="detail-label">{t('phone')}</span>
                    <span className="detail-value">{profile.phone}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <MapPin size={16} />
                  <div>
                    <span className="detail-label">{t('village')}</span>
                    <span className="detail-value">{profile.village}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <div>
                    <span className="detail-label">{t('joined')}</span>
                    <span className="detail-value">{formatDate(profile.joinedAt)}</span>
                  </div>
                </div>
              </div>
              {profile.bio && (
                <div className="bio-section">
                  <h4 className="bio-title">{t('about')}</h4>
                  <p className="bio-text">{profile.bio}</p>
                </div>
              )}
            </div>

            <div className="quick-stats">
              <h3 className="section-title">
                <TrendingUp size={20} />
                {t('quick_stats')}
              </h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FileText size={24} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{profile.stats.totalSubmissions}</div>
                    <div className="stat-label">{t('total_submissions')}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Eye size={24} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{profile.stats.totalViews}</div>
                    <div className="stat-label">{t('total_views')}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Award size={24} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{profile.stats.approvedSubmissions}</div>
                    <div className="stat-label">{t('approved')}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <TrendingUp size={24} />
                  </div>
                  <div className="stat-content">
                    <div className="stat-number">{profile.stats.thisMonthSubmissions}</div>
                    <div className="stat-label">{t('this_month')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-section">
            <h3 className="section-title">
              <Activity size={20} />
              {t('recent_activity')}
            </h3>
            <div className="activity-list">
              {profile.stats.recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div 
                    className="activity-icon"
                    style={{ color: getActivityColor(activity.type) }}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-meta">
                      <span className="activity-type">{t(activity.type)}</span>
                      <span className="activity-time">
                        <Clock size={12} />
                        {formatDateTime(activity.timestamp)}
                      </span>
                    </div>
                    {activity.status && (
                      <span 
                        className={`activity-status status-${activity.status}`}
                      >
                        {t(activity.status)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-section">
            <h3 className="section-title">
              <BarChart3 size={20} />
              {t('detailed_statistics')}
            </h3>
            <div className="stats-overview">
              <div className="stat-row">
                <div className="stat-item">
                  <span className="stat-label">{t('total_submissions')}</span>
                  <span className="stat-value">{profile.stats.totalSubmissions}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{t('approved_submissions')}</span>
                  <span className="stat-value">{profile.stats.approvedSubmissions}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{t('rejected_submissions')}</span>
                  <span className="stat-value">{profile.stats.rejectedSubmissions}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{t('pending_submissions')}</span>
                  <span className="stat-value">{profile.stats.pendingSubmissions}</span>
                </div>
              </div>
              <div className="stat-row">
                <div className="stat-item">
                  <span className="stat-label">{t('total_views')}</span>
                  <span className="stat-value">{profile.stats.totalViews}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{t('average_views')}</span>
                  <span className="stat-value">{profile.stats.averageViewsPerArticle}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{t('this_month')}</span>
                  <span className="stat-value">{profile.stats.thisMonthSubmissions}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{t('last_month')}</span>
                  <span className="stat-value">{profile.stats.lastMonthSubmissions}</span>
                </div>
              </div>
            </div>
            <div className="top-category">
              <h4 className="category-title">{t('top_category')}</h4>
              <div className="category-badge">
                {t(profile.stats.topCategory)}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .user-profile-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .profile-header {
          background: var(--gradient-hero);
          color: white;
          padding: 3rem 2rem;
          border-radius: 24px;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .profile-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.3;
        }

        .profile-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 4px solid rgba(255,255,255,0.3);
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-placeholder {
          color: white;
          font-size: 2rem;
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          letter-spacing: -0.025em;
        }

        .profile-role {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: 1rem;
          text-transform: capitalize;
        }

        .profile-badges {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          box-shadow: var(--shadow-sm);
        }

        .trusted-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          background: rgba(255,255,255,0.2);
          color: white;
          backdrop-filter: blur(10px);
        }

        .profile-tabs {
          display: flex;
          background: var(--background-primary);
          border-radius: 16px;
          padding: 0.5rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-light);
        }

        .profile-tab {
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
        }

        .profile-tab.active {
          background: var(--gradient-primary);
          color: white;
          box-shadow: var(--shadow-md);
        }

        .profile-tab:hover:not(.active) {
          background: var(--background-secondary);
          color: var(--text-primary);
        }

        .profile-content-area {
          background: var(--background-primary);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-light);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--primary-color);
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--background-secondary);
          border-radius: 12px;
          border: 1px solid var(--border-light);
        }

        .detail-item svg {
          color: var(--primary-color);
          flex-shrink: 0;
        }

        .detail-label {
          display: block;
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .detail-value {
          display: block;
          font-size: 1rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        .bio-section {
          margin-top: 2rem;
          padding: 1.5rem;
          background: var(--background-secondary);
          border-radius: 12px;
          border: 1px solid var(--border-light);
        }

        .bio-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }

        .bio-text {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .quick-stats {
          margin-top: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--background-secondary);
          border-radius: 16px;
          border: 1px solid var(--border-light);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: var(--gradient-primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--background-secondary);
          border-radius: 12px;
          border: 1px solid var(--border-light);
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--background-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .activity-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .activity-type {
          text-transform: capitalize;
          font-weight: 500;
        }

        .activity-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .activity-status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-top: 0.5rem;
          display: inline-block;
        }

        .status-approved {
          background: #dcfce7;
          color: #166534;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .stats-overview {
          margin-bottom: 2rem;
        }

        .stat-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          background: var(--background-secondary);
          border-radius: 12px;
          border: 1px solid var(--border-light);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .top-category {
          padding: 1.5rem;
          background: var(--background-secondary);
          border-radius: 12px;
          border: 1px solid var(--border-light);
        }

        .category-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .category-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: var(--gradient-accent);
          color: white;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 768px) {
          .user-profile-page {
            padding: 1rem;
          }
          
          .profile-header {
            padding: 2rem 1.5rem;
          }
          
          .profile-content {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }
          
          .profile-name {
            font-size: 2rem;
          }
          
          .profile-content-area {
            padding: 1.5rem;
          }
          
          .details-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .stat-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .profile-avatar {
            width: 80px;
            height: 80px;
          }
          
          .profile-name {
            font-size: 1.75rem;
          }
          
          .profile-badges {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfilePage;
