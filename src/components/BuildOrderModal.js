import React from 'react';
import { useTranslation } from 'react-i18next';

const BuildOrderModal = ({ buildOrder, isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen || !buildOrder) return null;

  const getCategoryColor = (category) => {
    if (category === 'Economia') return '#6bcf7f';
    if (category === 'Militar') return '#ff6b6b';
    return '#ffd93d';
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Iniciante') return '#6bcf7f';
    if (difficulty === 'Intermediário') return '#ffd93d';
    return '#ff6b6b';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{buildOrder.name}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="build-order-info">
            <div className="info-row">
              <span className="info-label">{t('build_orders.civilization')}:</span>
              <span className="info-value">{buildOrder.civilization}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">{t('build_orders.category')}:</span>
              <span 
                className="info-value category-badge"
                style={{ color: getCategoryColor(buildOrder.category) }}
              >
                {buildOrder.category}
              </span>
            </div>
            
            <div className="info-row">
              <span className="info-label">{t('build_orders.difficulty')}:</span>
              <span 
                className="info-value difficulty-badge"
                style={{ color: getDifficultyColor(buildOrder.difficulty) }}
              >
                {buildOrder.difficulty}
              </span>
            </div>
            
            <div className="info-row">
              <span className="info-label">{t('build_orders.author')}:</span>
              <span className="info-value">{buildOrder.author}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">{t('build_orders.timeToAge')}:</span>
              <span className="info-value">⏱️ {buildOrder.timeToAge}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">{t('build_orders.rating')}:</span>
              <span className="info-value">⭐ {buildOrder.rating}</span>
            </div>
            
            <div className="info-row">
              <span className="info-label">{t('build_orders.views')}:</span>
              <span className="info-value">👁️ {buildOrder.views}</span>
            </div>
          </div>
          
          <div className="build-order-description">
            <h4>{t('build_orders.description')}</h4>
            <p>{buildOrder.description}</p>
          </div>
          
          <div className="build-order-steps">
            <h4>{t('build_orders.steps')}</h4>
            <ol>
              {buildOrder.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {t('common.close')}
          </button>
          <button className="btn">
            {t('build_orders.copyToClipboard')}
          </button>
          <button className="btn btn-secondary">
            {t('build_orders.print')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildOrderModal; 