import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { LiveVideo } from '../types';
import { Video, Users, Clock, MapPin, Tag, Play, Pause, Volume2, VolumeX, Share2, MessageCircle, Lock, Shield, Award, User, Camera, Settings, Radio } from 'lucide-react';

// Mock data for demonstration
const mockLiveVideos: LiveVideo[] = [
  {
    id: '1',
    title: 'Village Development Meeting - Live Coverage',
    description: 'Join us for live coverage of the monthly village development meeting where important decisions about infrastructure and community welfare will be discussed.',
    streamUrl: 'https://example.com/stream1',
    thumbnailUrl: 'https://via.placeholder.com/400x225/1e3a8a/ffffff?text=Live+Stream',
    isLive: true,
    viewerCount: 127,
    startedAt: '2024-01-15T14:00:00Z',
    host: {
      id: '1',
      name: 'Ram Singh',
      avatar: undefined
    },
    village: 'Village A',
    category: 'news',
    tags: ['development', 'meeting', 'community']
  },
  {
    id: '2',
    title: 'Traditional Festival Celebration',
    description: 'Experience the vibrant colors and sounds of our traditional festival with live music, dance performances, and cultural activities.',
    streamUrl: 'https://example.com/stream2',
    thumbnailUrl: 'https://via.placeholder.com/400x225/f59e0b/ffffff?text=Cultural+Event',
    isLive: false,
    viewerCount: 89,
    startedAt: '2024-01-14T10:00:00Z',
    endedAt: '2024-01-14T16:00:00Z',
    host: {
      id: '2',
      name: 'Priya Sharma',
      avatar: undefined
    },
    village: 'Village B',
    category: 'culture',
    tags: ['festival', 'tradition', 'celebration']
  }
];

const LiveVideoPage: React.FC = () => {
  const { t } = useLanguage();
  const { isTrusted, user } = useAuth();
  const [videos] = useState<LiveVideo[]>(mockLiveVideos);
  const [selectedVideo, setSelectedVideo] = useState<LiveVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [showGoLive, setShowGoLive] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [liveSettings, setLiveSettings] = useState({
    title: '',
    description: '',
    category: 'news',
    location: user?.village || ''
  });
  // Trust status is now managed by AuthContext

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
  };

  const formatViewerCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };


  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'news': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      case 'culture': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'scheme': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'issue': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'event': return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  };

  if (!isTrusted) {
    return (
      <div className="live-video-locked">
        <div className="locked-container">
          <div className="locked-icon">
            <Lock size={64} />
          </div>
          <h2 className="locked-title">{t('live_video_locked')}</h2>
          <p className="locked-message">
            {t('live_video_requirement')}
          </p>
          <div className="requirement-card">
            <div className="requirement-icon">
              <Shield size={32} />
            </div>
            <div className="requirement-content">
              <h3 className="requirement-title">{t('become_trusted_user')}</h3>
              <p className="requirement-description">
                {t('trust_requirement_description')}
              </p>
              <div className="progress-section">
                <div className="progress-label">
                  <span>{t('approved_submissions')}</span>
                  <span>0 / 20</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '0%' }} />
                </div>
                <p className="progress-text">
                  {t('submissions_remaining')} 20
                </p>
              </div>
            </div>
          </div>
          <div className="trust-benefits">
            <h4 className="benefits-title">{t('trust_benefits')}</h4>
            <div className="benefits-list">
              <div className="benefit-item">
                <Video size={20} />
                <span>{t('live_video_access')}</span>
              </div>
              <div className="benefit-item">
                <Award size={20} />
                <span>{t('trusted_badge')}</span>
              </div>
              <div className="benefit-item">
                <Shield size={20} />
                <span>{t('priority_support')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="live-video-page">
      <div className="video-header">
        <div className="header-content">
          <div className="header-icon">
            <Video size={32} />
          </div>
          <div>
            <h1 className="header-title">{t('live_videos')}</h1>
            <p className="header-subtitle">{t('watch_live_community_events')}</p>
          </div>
        </div>
        <div className="trust-badge">
          <Shield size={16} />
          {t('trusted_user')}
        </div>
      </div>

      {selectedVideo ? (
        <div className="video-player-section">
          <div className="video-container">
            <div className="video-player">
              <div className="video-placeholder">
                <div className="play-button" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause size={48} /> : <Play size={48} />}
                </div>
                <div className="video-overlay">
                  <div className="video-info">
                    <h3 className="video-title">{selectedVideo.title}</h3>
                    <div className="video-meta">
                      <span className="viewer-count">
                        <Users size={16} />
                        {formatViewerCount(selectedVideo.viewerCount)} {t('viewers')}
                      </span>
                      <span className="duration">
                        <Clock size={16} />
                        {formatDuration(selectedVideo.startedAt, selectedVideo.endedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="video-controls">
              <button 
                className="control-btn"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button 
                className="control-btn"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <button className="control-btn">
                <Share2 size={20} />
              </button>
              <button 
                className="control-btn"
                onClick={() => setShowChat(!showChat)}
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </div>

          <div className="video-details">
            <div className="video-description">
              <h3 className="description-title">{t('description')}</h3>
              <p className="description-text">{selectedVideo.description}</p>
            </div>
            <div className="video-tags">
              {selectedVideo.tags.map((tag) => (
                <span key={tag} className="tag">
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {showChat && (
            <div className="chat-section">
              <div className="chat-header">
                <h4 className="chat-title">{t('live_chat')}</h4>
                <button 
                  className="close-chat"
                  onClick={() => setShowChat(false)}
                >
                  ×
                </button>
              </div>
              <div className="chat-messages">
                <div className="chat-message">
                  <span className="message-user">Ram Singh:</span>
                  <span className="message-text">Welcome to the live stream!</span>
                </div>
                <div className="chat-message">
                  <span className="message-user">Priya:</span>
                  <span className="message-text">Great coverage, thank you!</span>
                </div>
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={t('type_message')}
                  className="message-input"
                />
                <button className="send-button">
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Go Live Section for Trusted Reporters */}
          {isTrusted ? (
            <div className="go-live-section">
              <div className="go-live-header">
                <div className="go-live-icon">
                  <Radio size={24} />
                </div>
                <div>
                  <h2 className="go-live-title">{t('go_live')}</h2>
                  <p className="go-live-subtitle">{t('start_live_stream')}</p>
                </div>
              </div>
              
              {!isLive ? (
                <div className="go-live-controls">
                  <button 
                    className="btn btn-primary go-live-btn"
                    onClick={() => setShowGoLive(true)}
                  >
                    <Camera size={20} />
                    {t('start_streaming')}
                  </button>
                </div>
              ) : (
                <div className="live-controls">
                  <div className="live-status">
                    <div className="live-dot" />
                    <span>{t('live_now')}</span>
                  </div>
                  <div className="live-actions">
                    <button 
                      className="btn btn-danger"
                      onClick={() => setIsLive(false)}
                    >
                      {t('end_stream')}
                    </button>
                    <button className="btn btn-secondary">
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="trust-required-section">
              <div className="trust-icon">
                <Lock size={48} />
              </div>
              <h2 className="trust-title">{t('trust_required')}</h2>
              <p className="trust-message">{t('trust_required_message')}</p>
              <div className="trust-progress">
                <div className="progress-header">
                  <span className="progress-label">{t('approved_submissions')}</span>
                  <span className="progress-count">0 / 20</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '0%' }} />
                </div>
                <p className="progress-text">
                  {t('submissions_remaining')} 20
                </p>
              </div>
              <div className="trust-benefits">
                <h4 className="benefits-title">{t('trust_benefits')}</h4>
                <div className="benefits-list">
                  <div className="benefit-item">
                    <div className="benefit-icon">🎥</div>
                    <div className="benefit-text">
                      <strong>{t('go_live')}</strong>
                      <p>{t('go_live_benefit')}</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">👥</div>
                    <div className="benefit-text">
                      <strong>{t('community_access')}</strong>
                      <p>{t('community_access_benefit')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="video-grid">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="video-card"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="video-thumbnail">
                <img src={video.thumbnailUrl} alt={video.title} />
                <div className="video-overlay">
                  <div className="play-icon">
                    <Play size={32} />
                  </div>
                  {video.isLive && (
                    <div className="live-indicator">
                      <div className="live-dot" />
                      {t('live')}
                    </div>
                  )}
                </div>
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-description">{video.description}</p>
                <div className="video-meta">
                  <div className="meta-item">
                    <Users size={14} />
                    <span>{formatViewerCount(video.viewerCount)} {t('viewers')}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={14} />
                    <span>{video.village}</span>
                  </div>
                  <div className="meta-item">
                    <span 
                      className="category-badge"
                      style={{
                        background: getCategoryGradient(video.category)
                      }}
                    >
                      {t(video.category)}
                    </span>
                  </div>
                </div>
                <div className="video-host">
                  <div className="host-avatar">
                    {video.host.avatar ? (
                      <img src={video.host.avatar} alt={video.host.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                  <span className="host-name">{video.host.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {/* Go Live Modal */}
      {showGoLive && (
        <div className="go-live-modal">
          <div className="modal-overlay" onClick={() => setShowGoLive(false)} />
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{t('start_live_stream')}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowGoLive(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">{t('stream_title')}</label>
                <input
                  type="text"
                  className="form-input"
                  value={liveSettings.title}
                  onChange={(e) => setLiveSettings(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t('enter_stream_title')}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('description')}</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={liveSettings.description}
                  onChange={(e) => setLiveSettings(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('enter_stream_description')}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('category')}</label>
                <select
                  className="form-input"
                  value={liveSettings.category}
                  onChange={(e) => setLiveSettings(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="news">{t('news')}</option>
                  <option value="culture">{t('culture')}</option>
                  <option value="scheme">{t('scheme')}</option>
                  <option value="issue">{t('issue')}</option>
                  <option value="event">{t('event')}</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('location')}</label>
                <input
                  type="text"
                  className="form-input"
                  value={liveSettings.location}
                  onChange={(e) => setLiveSettings(prev => ({ ...prev, location: e.target.value }))}
                  placeholder={t('enter_location')}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowGoLive(false)}
              >
                {t('cancel')}
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setIsLive(true);
                  setShowGoLive(false);
                }}
              >
                <Radio size={16} />
                {t('go_live')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .live-video-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .video-header {
          background: var(--gradient-hero);
          color: white;
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .video-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.3;
        }

        .header-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: rgba(255,255,255,0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .header-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
          letter-spacing: -0.025em;
        }

        .header-subtitle {
          opacity: 0.9;
          font-size: 1rem;
          font-weight: 400;
        }

        .trust-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.2);
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .video-card {
          background: var(--background-primary);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-light);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .video-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .video-thumbnail {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
        }

        .video-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .video-card:hover .video-overlay {
          opacity: 1;
        }

        .play-icon {
          color: white;
          background: rgba(0,0,0,0.5);
          border-radius: 50%;
          padding: 1rem;
          backdrop-filter: blur(10px);
        }

        .live-indicator {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #ef4444;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .video-info {
          padding: 1.5rem;
        }

        .video-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .video-description {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .video-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .category-badge {
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .video-host {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .host-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--background-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .host-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          color: var(--text-secondary);
        }

        .host-name {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .video-player-section {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .video-container {
          background: var(--background-primary);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-light);
        }

        .video-player {
          position: relative;
          aspect-ratio: 16/9;
          background: #000;
        }

        .video-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .play-button {
          width: 80px;
          height: 80px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--primary-color);
        }

        .play-button:hover {
          transform: scale(1.1);
          background: white;
        }

        .video-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: var(--background-secondary);
          border-top: 1px solid var(--border-light);
        }

        .control-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--background-primary);
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--text-primary);
        }

        .control-btn:hover {
          background: var(--primary-color);
          color: white;
          transform: scale(1.1);
        }

        .video-details {
          background: var(--background-primary);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-light);
        }

        .description-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .description-text {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .video-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 1rem;
          background: var(--gradient-accent);
          color: white;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .chat-section {
          background: var(--background-primary);
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-light);
          max-height: 400px;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-light);
        }

        .chat-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .close-chat {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--background-secondary);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: var(--text-secondary);
        }

        .chat-messages {
          flex: 1;
          padding: 1rem 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .chat-message {
          display: flex;
          gap: 0.5rem;
        }

        .message-user {
          font-weight: 600;
          color: var(--primary-color);
        }

        .message-text {
          color: var(--text-secondary);
        }

        .chat-input {
          display: flex;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border-light);
        }

        .message-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          font-size: 0.95rem;
          background: var(--background-secondary);
        }

        .send-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gradient-primary);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .live-video-locked {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--gradient-hero);
        }

        .locked-container {
          background: var(--background-primary);
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          box-shadow: var(--shadow-xl);
          max-width: 500px;
          width: 100%;
        }

        .locked-icon {
          width: 100px;
          height: 100px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          color: white;
        }

        .locked-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .locked-message {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .requirement-card {
          background: var(--background-secondary);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid var(--border-light);
        }

        .requirement-icon {
          width: 64px;
          height: 64px;
          background: var(--gradient-accent);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: white;
        }

        .requirement-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }

        .requirement-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .progress-section {
          text-align: left;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: var(--background-primary);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: var(--gradient-accent);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .trust-benefits {
          text-align: left;
        }

        .benefits-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--background-primary);
          border-radius: 12px;
          border: 1px solid var(--border-light);
        }

        .benefit-item svg {
          color: var(--primary-color);
        }

        @media (max-width: 768px) {
          .live-video-page {
            padding: 1rem;
          }
          
          .video-header {
            padding: 1.5rem;
          }
          
          .header-title {
            font-size: 1.5rem;
          }
          
          .video-grid {
            grid-template-columns: 1fr;
          }
          
          .video-player-section {
            grid-template-columns: 1fr;
          }
        }

        /* Go Live Styles */
        .go-live-section {
          background: var(--background-primary);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
        }

        .go-live-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .go-live-icon {
          width: 48px;
          height: 48px;
          background: var(--gradient-primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .go-live-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .go-live-subtitle {
          color: var(--text-secondary);
          margin: 0.25rem 0 0 0;
        }

        .go-live-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .go-live-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .live-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--background-secondary);
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .live-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent-color);
          font-weight: 600;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: var(--accent-color);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .live-actions {
          display: flex;
          gap: 0.5rem;
        }

        .trust-required-section {
          background: var(--background-primary);
          border-radius: 20px;
          padding: 3rem 2rem;
          margin-bottom: 2rem;
          text-align: center;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
        }

        .trust-icon {
          width: 80px;
          height: 80px;
          background: var(--gradient-accent);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
        }

        .trust-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .trust-message {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .trust-progress {
          background: var(--background-secondary);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid var(--border-light);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .progress-label {
          font-weight: 600;
          color: var(--text-primary);
        }

        .progress-count {
          font-weight: 700;
          color: var(--accent-color);
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: var(--background-primary);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: var(--gradient-accent);
          transition: width 0.3s ease;
        }

        .progress-text {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin: 0;
        }

        .trust-benefits {
          background: var(--background-secondary);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid var(--border-light);
        }

        .benefits-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
          text-align: center;
        }

        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .benefit-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .benefit-text strong {
          display: block;
          color: var(--text-primary);
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .benefit-text p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin: 0;
        }

        /* Go Live Modal */
        .go-live-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }

        .modal-content {
          position: relative;
          background: var(--background-primary);
          border-radius: 20px;
          padding: 0;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-color);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: var(--background-secondary);
          color: var(--text-primary);
        }

        .modal-body {
          padding: 2rem;
        }

        .modal-footer {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding: 1.5rem 2rem;
          border-top: 1px solid var(--border-color);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default LiveVideoPage;
