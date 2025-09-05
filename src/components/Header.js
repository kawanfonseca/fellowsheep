import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = ({ onNavigate, currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { i18n, t } = useTranslation();

  const handleNavClick = (path, page) => {
    navigate(path);
    onNavigate(page);
    setIsMobileMenuOpen(false); // Fechar menu mobile após navegação
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Novo: seletor de idioma
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src="/FS-logo.png" alt="Fellowsheep Gaming" className="logo-image" />
          <h1>Fellowsheep </h1>
        </div>
        <select
          onChange={handleLanguageChange}
          value={i18n.language}
          style={{ marginLeft: 16, padding: '0.3rem 0.7rem', borderRadius: 8, border: '1px solid #d4af37', background: '#222', color: '#d4af37', fontWeight: 'bold' }}
        >
          <option value="pt">PT-BR</option>
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="de">DE</option>
          <option value="fr">FR</option>
          <option value="zh">ZH</option>
        </select>
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
        
        <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <button 
            className={`nav-button ${isActive('/') ? 'active' : ''}`}
            onClick={() => handleNavClick('/', 'home')}
          >
            {t('navigation.home')}
          </button>
          
          <div className="dropdown">
            <button className="nav-button">
              {t('navigation.lobby')}
            </button>
            <div className="dropdown-content">
              <button onClick={() => handleNavClick('/ranking', 'ranking')}>
                {t('navigation.ranking')}
              </button>
              <button onClick={() => handleNavClick('/lobby', 'lobby')}>
                {t('navigation.lobby')}
              </button>
              <button onClick={() => handleNavClick('/recent-matches', 'recent-matches')}>
                {t('navigation.recent_matches')}
              </button>
              <button onClick={() => handleNavClick('/live-matches', 'live-matches')}>
                {t('navigation.live_matches')}
              </button>
            </div>
          </div>
          
          <button 
            className={`nav-button ${isActive('/elo-tracker') ? 'active' : ''}`}
            onClick={() => handleNavClick('/elo-tracker', 'elo-tracker')}
          >
            📊 Elo Tracker
          </button>
          
          <div className="dropdown">
            <button className="nav-button">
              {t('navigation.coaching')}
            </button>
            <div className="dropdown-content">
              <button onClick={() => handleNavClick('/coaching', 'coaching')}>
                {t('navigation.coaching')}
              </button>
              <button onClick={() => handleNavClick('/build-orders', 'build-orders')}>
                {t('navigation.build_orders')}
              </button>
            </div>
          </div>
          
          <button 
            className={`nav-button ${isActive('/discord') ? 'active' : ''}`}
            onClick={() => handleNavClick('/discord', 'discord')}
          >
            {t('navigation.discord')}
          </button>
          
          <div className="dropdown">
            <button className="nav-button">
              {t('navigation.contact')}
            </button>
            <div className="dropdown-content">
              <button onClick={() => handleNavClick('/donations', 'donations')}>
                {t('navigation.donations')}
              </button>
              <button onClick={() => handleNavClick('/contact', 'contact')}>
                {t('navigation.contact')}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 