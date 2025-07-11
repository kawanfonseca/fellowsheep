import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const socialLinks = [
    {
      name: 'Discord',
      url: 'https://discord.gg/fellowsheep',
      icon: '💬',
      color: '#5865F2'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@fellowsheepgaming',
      icon: '📺',
      color: '#FF0000'
    },
    {
      name: 'Twitch',
      url: 'https://twitch.tv/fellowsheepgaming',
      icon: '🎮',
      color: '#9146FF'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/fellowsheepgaming',
      icon: '🐦',
      color: '#1DA1F2'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/fellowsheepgaming',
      icon: '📷',
      color: '#E4405F'
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <img src="/FS-logo.png" alt="Fellowsheep Gaming" className="footer-logo-image" />
            <h3>Fellowsheep Gaming</h3>
          </div>
          <p className="footer-description">
            {t('footer.description')}
          </p>
        </div>
        
        <div className="footer-section">
          <h4>{t('footer.social_media')}</h4>
          <div className="social-links">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                style={{ '--social-color': social.color }}
                title={social.name}
              >
                <span className="social-icon">{social.icon}</span>
                <span className="social-name">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
        
        <div className="footer-section">
          <h4>{t('footer.quick_links')}</h4>
          <div className="footer-links">
            <a href="/ranking" className="footer-link">{t('navigation.ranking')}</a>
            <a href="/lobby" className="footer-link">{t('navigation.lobby')}</a>
            <a href="/coaching" className="footer-link">{t('navigation.coaching')}</a>
            <a href="/discord" className="footer-link">{t('navigation.discord')}</a>
            <a href="/contact" className="footer-link">{t('navigation.contact')}</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            © 2024 Fellowsheep Gaming. {t('footer.all_rights_reserved')}
          </p>
          <div className="footer-bottom-links">
            <a href="/privacy" className="footer-bottom-link">{t('footer.privacy_policy')}</a>
            <a href="/terms" className="footer-bottom-link">{t('footer.terms_of_service')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 