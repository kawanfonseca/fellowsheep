import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já escolheu um idioma
    const hasChosenLanguage = localStorage.getItem('language-chosen');
    if (!hasChosenLanguage) {
      setShowModal(true);
    }
    
    // Para teste - remover depois
    // setShowModal(true);
  }, []);

  const handleLanguageSelect = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language-chosen', 'true');
    localStorage.setItem('preferred-language', language);
    setShowModal(false);
  };

  const languages = [
    { 
      code: 'pt', 
      name: 'Português', 
      flag: 'https://flagcdn.com/w40/br.png',
      flagText: 'BR' 
    },
    { 
      code: 'en', 
      name: 'English', 
      flag: 'https://flagcdn.com/w40/us.png',
      flagText: 'US' 
    },
    { 
      code: 'es', 
      name: 'Español', 
      flag: 'https://flagcdn.com/w40/es.png',
      flagText: 'ES' 
    },
    { 
      code: 'de', 
      name: 'Deutsch', 
      flag: 'https://flagcdn.com/w40/de.png',
      flagText: 'DE' 
    },
    { 
      code: 'fr', 
      name: 'Français', 
      flag: 'https://flagcdn.com/w40/fr.png',
      flagText: 'FR' 
    },
    { 
      code: 'zh', 
      name: '中文', 
      flag: 'https://flagcdn.com/w40/cn.png',
      flagText: 'CN' 
    }
  ];

  if (!showModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: '#1a1a1a',
        border: '2px solid #d4af37',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '600px',
        width: '90%',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#d4af37', marginBottom: '1rem' }}>
          🌍 Escolha seu idioma / Choose your language
        </h2>
        <p style={{ color: '#e0e0e0', marginBottom: '2rem' }}>
          Selecione o idioma de sua preferência para uma melhor experiência.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              style={{
                background: '#2d2d2d',
                border: '2px solid #d4af37',
                borderRadius: '8px',
                padding: '1rem',
                color: '#e0e0e0',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                minHeight: '80px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#d4af37';
                e.target.style.color = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#2d2d2d';
                e.target.style.color = '#e0e0e0';
              }}
            >
              <img 
                src={lang.flag} 
                alt={`Bandeira ${lang.name}`}
                style={{ 
                  width: '40px',
                  height: '30px',
                  borderRadius: '4px',
                  border: '1px solid #444',
                  marginBottom: '0.5rem'
                }}
              />
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#d4af37',
                fontWeight: 'bold',
                marginBottom: '0.25rem'
              }}>
                {lang.flagText}
              </div>
              <div style={{ 
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                {lang.name}
              </div>
            </button>
          ))}
        </div>
        
        <p style={{ color: '#888', fontSize: '0.9rem' }}>
          Você pode alterar o idioma a qualquer momento no cabeçalho do site.
        </p>
      </div>
    </div>
  );
};

export default LanguageSelector; 