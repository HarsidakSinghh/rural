import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContextFree';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Shield, ArrowLeft } from 'lucide-react';

const Register: React.FC = () => {
  const { t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    village: '',
    password: '',
    role: 'reporter' as const
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await register(formData);
      if (success) {
        navigate('/profile');
      } else {
        setError(t('registration_error'));
      }
    } catch (err) {
      setError(t('registration_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <button 
              className="back-button"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft size={20} />
            </button>
            <div className="register-icon">
              <Shield size={32} />
            </div>
            <h2 className="register-title">
              {t('register_as_reporter')}
            </h2>
            <p className="register-subtitle">
              {t('join_our_newsroom')}
            </p>
          </div>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                {t('full_name')}
              </label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t('enter_full_name')}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={16} />
                {t('email')}
              </label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('enter_email')}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Phone size={16} />
                {t('phone')}
              </label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t('enter_phone')}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} />
                {t('village')}
              </label>
              <input
                type="text"
                name="village"
                className="form-input"
                value={formData.village}
                onChange={handleInputChange}
                placeholder={t('enter_village')}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Shield size={16} />
                {t('password')}
              </label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t('enter_password')}
                required
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary register-button" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner" />
                  {t('creating_account')}
                </>
              ) : (
                t('create_account')
              )}
            </button>
          </form>

          <div className="register-benefits">
            <h4 className="benefits-title">{t('reporter_benefits')}</h4>
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">📰</div>
                <div className="benefit-text">
                  <strong>{t('submit_news')}</strong>
                  <p>{t('submit_news_desc')}</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🎥</div>
                <div className="benefit-text">
                  <strong>{t('go_live')}</strong>
                  <p>{t('go_live_desc')}</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🏆</div>
                <div className="benefit-text">
                  <strong>{t('build_trust')}</strong>
                  <p>{t('build_trust_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: var(--gradient-hero);
          position: relative;
          overflow: hidden;
        }

        .register-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.3;
        }

        .register-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 500px;
        }

        .register-card {
          background: var(--background-primary);
          border-radius: 24px;
          padding: 3rem 2rem;
          box-shadow: var(--shadow-xl);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(20px);
        }

        .register-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .back-button {
          position: absolute;
          top: 0;
          left: 0;
          background: var(--background-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.75rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: var(--background-primary);
          color: var(--text-primary);
          transform: translateX(-2px);
        }

        .register-icon {
          width: 64px;
          height: 64px;
          background: var(--gradient-primary);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: white;
        }

        .register-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
          line-height: 1.2;
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        .register-subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
          font-weight: 400;
          line-height: 1.5;
          opacity: 0.8;
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        .register-form {
          margin-bottom: 2rem;
        }

        .register-form .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .register-form .form-input {
          margin-bottom: 0;
        }

        .register-button {
          width: 100%;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.25rem;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .register-button .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .register-benefits {
          background: var(--background-secondary);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid var(--border-light);
        }

        .benefits-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
          text-align: center;
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
          letter-spacing: -0.01em;
        }

        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.75rem;
          background: rgba(0,0,0,0.02);
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .benefit-item:hover {
          background: rgba(0,0,0,0.04);
          transform: translateY(-1px);
        }

        .benefit-icon {
          font-size: 1.75rem;
          flex-shrink: 0;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .benefit-text strong {
          display: block;
          color: var(--text-primary);
          font-weight: 600;
          margin-bottom: 0.375rem;
          font-size: 1rem;
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        .benefit-text p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin: 0;
          line-height: 1.5;
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        @media (max-width: 480px) {
          .register-card {
            padding: 2rem 1.5rem;
          }
          
          .register-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
