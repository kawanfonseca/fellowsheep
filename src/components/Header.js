import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ onNavigate, currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src="/logo.png" alt="Fellowsheep Gaming" className="logo-image" />
          <h1>Fellowsheep </h1>
        </div>
        
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
        
        <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <button 
            className={`nav-button ${isActive('/') ? 'active' : ''}`}
            onClick={() => handleNavClick('/', 'home')}
          >
            🏠 Home
          </button>
          
          <div className="dropdown">
            <button className="nav-button">
              🎮 Partidas ▼
            </button>
            <div className="dropdown-content">
              <button onClick={() => handleNavClick('/ranking', 'ranking')}>
                🏆 Ranking
              </button>
              <button onClick={() => handleNavClick('/lobby', 'lobby')}>
                🎯 Lobby & Matchmaking
              </button>
              <button onClick={() => handleNavClick('/recent-matches', 'recent-matches')}>
                📊 Partidas Recentes
              </button>
              <button onClick={() => handleNavClick('/live-matches', 'live-matches')}>
                🔴 Ao Vivo
              </button>
            </div>
          </div>
          
          <div className="dropdown">
            <button className="nav-button">
              🎓 Aprendizado ▼
            </button>
            <div className="dropdown-content">
              <button onClick={() => handleNavClick('/coaching', 'coaching')}>
                👨‍🏫 Coaching
              </button>
              <button onClick={() => handleNavClick('/build-orders', 'build-orders')}>
                📜 Build Orders
              </button>
            </div>
          </div>
          
          <button 
            className={`nav-button ${isActive('/discord') ? 'active' : ''}`}
            onClick={() => handleNavClick('/discord', 'discord')}
          >
            💬 Discord
          </button>
          
          <div className="dropdown">
            <button className="nav-button">
              ℹ️ Informações ▼
            </button>
            <div className="dropdown-content">
              <button onClick={() => handleNavClick('/donations', 'donations')}>
                💰 Doações
              </button>
              <button onClick={() => handleNavClick('/contact', 'contact')}>
                📞 Contato
              </button>
            </div>
          </div>
          
          <div className="dropdown">
            <button className="nav-button">
              🌐 Mídias Sociais ▼
            </button>
            <div className="dropdown-content">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                🐦 Twitter
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                📺 YouTube
              </a>
              <a href="https://twitch.tv" target="_blank" rel="noopener noreferrer">
                🎥 Twitch
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                📸 Instagram
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 