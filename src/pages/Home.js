import React from 'react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <h1 className="page-title">{t('home.title')}</h1>
      <p className="page-subtitle">
        {t('home.subtitle')}
      </p>
      
      <div className="card">
        <h3>{t('home.about_title')}</h3>
        <p>
          {t('home.about_text')}
        </p>
      </div>
      
      <div className="card">
        <h3>{t('home.pillars_title')}</h3>
        <p>
          <strong>{t('home.competition')}</strong> {t('home.competition_text')}<br/>
          <strong>{t('home.learning')}</strong> {t('home.learning_text')}<br/>
          <strong>{t('home.community')}</strong> {t('home.community_text')}<br/>
          <strong>{t('home.fun')}</strong> {t('home.fun_text')}
        </p>
      </div>
      
      <div className="card">
        <h3>{t('home.highlights_title')}</h3>
        <p>
          • {t('home.highlight1')}<br/>
          • {t('home.highlight2')}<br/>
          • {t('home.highlight3')}<br/>
          • {t('home.highlight4')}
        </p>
      </div>
      
      <div className="card">
        <h3>{t('home.join_title')}</h3>
        <p>
          {t('home.join_text')}
        </p>
        <button className="btn" style={{marginTop: '1rem'}}>
          {t('home.join_button')}
        </button>
      </div>
    </div>
  );
};

export default Home; 