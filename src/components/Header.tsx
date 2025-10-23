import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Globe, Menu, X, User, Video, Shield, LogIn, UserPlus } from 'lucide-react';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, logout, isAdmin, isReporter } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const languages: Array<'en' | 'hi' | 'pa'> = ['en', 'hi', 'pa'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'en': return 'EN';
      case 'hi': return 'हि';
      case 'pa': return 'ਪਾ';
      default: return 'EN';
    }
  };

  // ✅ use isActive for highlighting current route
  const isActive = (path: string) => location.pathname === path;

  const renderNavigation = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            {t('home')}
          </Link>
          <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
            <LogIn size={16} />
            {t('login')}
          </Link>
          <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>
            <UserPlus size={16} />
            {t('register')}
          </Link>
        </>
      );
    }

    if (isAdmin) {
      return (
        <>
          <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
            <Shield size={16} />
            {t('dashboard')}
          </Link>
        </>
      );
    }

    if (isReporter) {
      return (
        <>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            {t('home')}
          </Link>
          <Link to="/submit" className={`nav-link ${isActive('/submit') ? 'active' : ''}`}>
            {t('submit_news')}
          </Link>
          <Link to="/live" className={`nav-link ${isActive('/live') ? 'active' : ''}`}>
            <Video size={16} />
            {t('go_live')}
          </Link>
          <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
            <User size={16} />
            {t('profile')}
          </Link>
        </>
      );
    }

    return null;
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <Link to="/" className="logo">
          {language === 'hi' ? 'ग्राम समाचार' : 
           language === 'pa' ? 'ਪਿੰਡ ਸਮਾਚਾਰ' : 
           'Gram Samachar'}
        </Link>
        
        <div className="header-actions">
          {/* Desktop Navigation */}
          <nav className="nav-links">
            {renderNavigation()}
            {isAuthenticated && (
              <button 
                onClick={logout}
                className="btn btn-danger"
              >
                {t('logout')}
              </button>
            )}
          </nav>

          <button 
            className="language-toggle"
            onClick={toggleLanguage}
            title={t('language')}
          >
            <Globe size={16} />
            <span>{getLanguageLabel()}</span>
          </button>
          
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className="mobile-nav">
          <div className="mobile-nav-content">
            {renderNavigation()}
            {isAuthenticated && (
              <button 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="btn btn-danger"
                style={{
                  textAlign: 'left',
                  width: '100%',
                  justifyContent: 'flex-start'
                }}
              >
                {t('logout')}
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
