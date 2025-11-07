import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContextFree';
import { useAuth } from '../contexts/AuthContext';
import { NewsCategory } from '../types';
import { MapPin, Upload, FileText, MapPin as MapPinIcon, Image, X } from 'lucide-react';
import apiService from '../services/api';

const SubmitNews: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NewsCategory>('news');
  const [village, setVillage] = useState('');

  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<Array<{file: File, preview: string, caption?: string}>>([]);

  // Auto-fill village from user profile
  useEffect(() => {
    if (user?.village) {
      setVillage(user.village);
    }
  }, [user]);

  const categories = [
    { value: 'news', label: t('news') },
    { value: 'scheme', label: t('scheme') },
    { value: 'culture', label: t('culture') },
    { value: 'issue', label: t('issue') },
    { value: 'event', label: t('event') },
    { value: 'agriculture', label: t('agriculture') },
    { value: 'education', label: t('education') },
    { value: 'health', label: t('health') },
    { value: 'infrastructure', label: t('infrastructure') },
    { value: 'other', label: t('other') }
  ];

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => alert(t('location_access_denied'))
      );
    }
  };

  const handleImageUpload = (files: FileList) => {
    const newImages: Array<{file: File, preview: string, caption?: string}> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newImages.push({
          file,
          preview: URL.createObjectURL(file),
          caption: ''
        });
      }
    }

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const updateImageCaption = (index: number, caption: string) => {
    setImages(prev => prev.map((img, i) =>
      i === index ? { ...img, caption } : img
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newsData = {
        title,
        content,
        category,
        village: village || user?.village || '',
        location: location ? {
          latitude: location.lat,
          longitude: location.lng
        } : {
          latitude: 0,
          longitude: 0
        },
        tags: [],
        imageFiles: images.map(img => img.file)
      };

      await apiService.submitNews(newsData);
      alert(t('submission_success'));
      navigate('/');
    } catch (error) {
      console.error('Submission error:', error);
      alert(t('submission_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-news-page">
      <div className="submit-header">
        <div className="submit-icon">
          <FileText size={32} />
        </div>
        <h2 className="submit-title">{t('submit_story')}</h2>
        <p className="submit-subtitle">{t('share_your_community_news')}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="submit-form">
        <div className="form-section">
          <h3 className="section-title">
            <FileText size={20} />
            {t('story_details')}
          </h3>
          
          <div className="form-group">
            <label className="form-label">{t('title')} *</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('enter_story_title')}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('content')} *</label>
            <textarea
              className="form-input form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('write_your_story')}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('category')}</label>
              <select
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsCategory)}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t('village')} *</label>
              <input
                type="text"
                className="form-input"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder={t('enter_village_name')}
                required
              />
            </div>
          </div>
        </div>


        <div className="form-section">
          <h3 className="section-title">
            <MapPinIcon size={20} />
            {t('location_media')}
          </h3>
          
          <div className="form-group">
            <label className="form-label">{t('location')}</label>
            <button
              type="button"
              onClick={getLocation}
              className="btn btn-secondary location-button"
            >
              <MapPin size={16} />
              {location ? t('location_updated') : t('enable_location')}
            </button>
            {location && (
              <div className="location-display">
                <span className="location-icon">✓</span>
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">{t('photo_upload')}</label>
            <div className="photo-upload">
              <input
                type="file"
                accept="image/*"
                multiple
                id="photo-upload"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
              />
              <label htmlFor="photo-upload" className="photo-upload-label">
                <Image size={32} />
                <p className="photo-upload-text">
                  {t('drag_drop_photos')}
                </p>
                <p className="photo-upload-hint">{t('or_click_to_browse')}</p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="uploaded-images">
                {images.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img src={image.preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image-btn"
                    >
                      <X size={16} />
                    </button>
                    <input
                      type="text"
                      placeholder={t('add_caption')}
                      value={image.caption || ''}
                      onChange={(e) => updateImageCaption(index, e.target.value)}
                      className="image-caption-input"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">{t('audio_upload')}</label>
            <div className="audio-upload">
              <input
                type="file"
                accept="audio/*"
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="audio-upload-label">
                <Upload size={32} />
                <p className="audio-upload-text">{t('drag_drop_audio')}</p>
                <p className="audio-upload-hint">{t('or_click_to_browse')}</p>
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary submit-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner" />
                {t('submitting')}
              </>
            ) : (
              <>
                <FileText size={18} />
                {t('submit')}
              </>
            )}
          </button>
        </div>
      </form>

      <style>{`
        .submit-news-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .submit-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .submit-icon {
          width: 80px;
          height: 80px;
          background: var(--gradient-primary);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
          box-shadow: var(--shadow-lg);
        }

        .submit-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          letter-spacing: -0.025em;
        }

        .submit-subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
          font-weight: 400;
        }

        .submit-form {
          background: var(--background-primary);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-light);
        }

        .form-section {
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-light);
        }

        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--primary-color);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .location-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          justify-content: center;
        }

        .location-display {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: var(--background-secondary);
          border-radius: 12px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid var(--border-light);
        }

        .location-icon {
          color: #10b981;
          font-weight: bold;
        }

        .audio-upload {
          border: 2px dashed var(--border-color);
          border-radius: 16px;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: var(--background-secondary);
          position: relative;
        }

        .audio-upload:hover {
          border-color: var(--primary-color);
          background: rgba(30, 58, 138, 0.02);
          transform: translateY(-2px);
        }

        .audio-upload input[type="file"] {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .audio-upload-label {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .audio-upload-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .audio-upload-hint {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .photo-upload {
          border: 2px dashed var(--border-color);
          border-radius: 16px;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: var(--background-secondary);
          position: relative;
        }

        .photo-upload:hover:not(:has(input:disabled)) {
          border-color: var(--primary-color);
          background: rgba(30, 58, 138, 0.02);
          transform: translateY(-2px);
        }

        .photo-upload input[type="file"] {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .photo-upload:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .photo-upload-label {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .photo-upload-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .photo-upload-hint {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .uploaded-images {
          margin-top: 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .image-preview {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: var(--background-primary);
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
        }

        .image-preview img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          display: block;
        }

        .remove-image-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .remove-image-btn:hover {
          background: rgba(239, 68, 68, 1);
          transform: scale(1.1);
        }

        .image-caption-input {
          width: 100%;
          padding: 0.5rem;
          border: none;
          border-top: 1px solid var(--border-light);
          font-size: 0.85rem;
          background: var(--background-secondary);
          color: var(--text-primary);
        }

        .image-caption-input:focus {
          outline: none;
          background: var(--background-primary);
        }

        .image-caption-input::placeholder {
          color: var(--text-secondary);
        }

        .form-actions {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-light);
          text-align: center;
        }

        .submit-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1.25rem 3rem;
          font-size: 1.1rem;
          font-weight: 600;
          min-width: 200px;
          justify-content: center;
        }

        .submit-button .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .submit-title {
            font-size: 2rem;
          }
          
          .submit-form {
            padding: 1.5rem;
          }
          
          .form-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .submit-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .submit-news-page {
            padding: 1rem;
          }
          
          .submit-header {
            margin-bottom: 2rem;
          }
          
          .submit-icon {
            width: 60px;
            height: 60px;
          }
          
          .submit-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SubmitNews;
