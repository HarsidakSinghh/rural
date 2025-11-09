import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContextFree';
import { useAuth } from '../contexts/AuthContext';
import { Globe, User, Video, Shield, LogIn, UserPlus, Moon, Sun, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, logout, isAdmin, isReporter } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle theme toggle
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(initialDarkMode);
    document.documentElement.setAttribute('data-theme', initialDarkMode ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

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
          {language === 'hi' ? 'ग्रामपल्स' :
           language === 'pa' ? 'ਗ੍ਰਾਮਪਲਸ' :
           'GramPulse'}
        </Link>
        
        <div className="header-actions">
          {/* Desktop Navigation */}
          <nav className="nav-links desktop-nav">
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
            className="theme-toggle"
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            className="language-toggle"
            onClick={toggleLanguage}
            title={t('language')}
          >
            <Globe size={16} />
            <span>{getLanguageLabel()}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title="Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="mobile-nav">
            <div className="mobile-nav-content">
              {renderNavigation()}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn btn-danger mobile-logout"
                >
                  {t('logout')}
                </button>
              )}
            </div>
          </nav>
        )}
      </div>


    </header>
  );
};

export default Header;

// Mobile Navigation Styles
const mobileNavStyles = `
  .mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .mobile-menu-toggle:hover {
    background: var(--background-secondary);
  }

  .mobile-nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--background-primary);
    border-top: 1px solid var(--border-light);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
  }

  .mobile-nav-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }

  .mobile-nav .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    color: var(--text-primary);
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-weight: 500;
  }

  .mobile-nav .nav-link:hover,
  .mobile-nav .nav-link.active {
    background: var(--primary-color);
    color: white;
  }

  .mobile-nav .nav-link svg {
    flex-shrink: 0;
  }

  .mobile-logout {
    margin-top: 0.5rem;
    width: 100%;
    justify-content: flex-start;
  }

  @media (max-width: 768px) {
    .desktop-nav {
      display: none;
    }

    .mobile-menu-toggle {
      display: block;
    }

    .theme-toggle,
    .language-toggle {
      display: none;
    }
  }

  @media (min-width: 769px) {
    .mobile-nav {
      display: none !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mobileNavStyles;
  document.head.appendChild(styleSheet);
}
