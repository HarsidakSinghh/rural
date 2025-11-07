import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContextFree';
import { useAuth } from '../contexts/AuthContext';
import { User, Lock, Shield } from 'lucide-react';

const Login: React.FC = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        // Redirect admins directly to dashboard, others to home
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(t('invalid_credentials'));
      }
    } catch (err) {
      setError(t('login_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <Shield size={32} />
            </div>
            <h2 className="login-title">
              {t('login')}
            </h2>
            <p className="login-subtitle">
              {t('access_your_account')}
            </p>
          </div>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                {t('email')}
              </label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('enter_email')}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={16} />
                {t('password')}
              </label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('enter_password')}
                required
              />
            </div>


            <button 
              type="submit" 
              className="btn btn-primary login-button" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner" />
                  {t('logging_in')}
                </>
              ) : (
                t('login')
              )}
            </button>
          </form>

          <div className="demo-credentials">
            <h4 className="demo-title">{t('demo_credentials')}</h4>
            <div className="demo-item">
              <span className="demo-role">{t('admin')}:</span>
              <span className="demo-credential">admin / admin123</span>
            </div>
            <div className="demo-item">
              <span className="demo-role">{t('reporter')} (Trusted):</span>
              <span className="demo-credential">ram.singh / reporter123</span>
            </div>
            <div className="demo-item">
              <span className="demo-role">{t('reporter')} (New):</span>
              <span className="demo-credential">priya.sharma / reporter123</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: var(--gradient-hero);
          position: relative;
          overflow: hidden;
        }

        .login-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.3;
        }

        .login-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 450px;
        }

        .login-card {
          background: var(--background-primary);
          border-radius: 24px;
          padding: 3rem 2rem;
          box-shadow: var(--shadow-xl);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(20px);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-icon {
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

        .login-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          letter-spacing: -0.025em;
        }

        .login-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 400;
        }

        .login-form {
          margin-bottom: 2rem;
        }

        .login-form .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .login-form .form-input {
          margin-bottom: 0;
        }

        .login-button {
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

        .login-button .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .demo-credentials {
          background: var(--background-secondary);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid var(--border-light);
        }

        .demo-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
          text-align: center;
        }

        .demo-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-light);
        }

        .demo-item:last-child {
          border-bottom: none;
        }

        .demo-role {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .demo-credential {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          background: var(--background-primary);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 2rem 1.5rem;
          }
          
          .login-title {
            font-size: 1.75rem;
          }
          
          .demo-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
