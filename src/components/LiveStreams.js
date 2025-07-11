import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import liveService from '../services/liveService';

const LiveStreams = () => {
  const { t } = useTranslation();
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setLoading(true);
        const liveStreams = await liveService.getAllLiveStreams();
        setStreams(liveStreams);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar streams ao vivo');
        console.error('Erro ao buscar streams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();

    // Atualizar a cada 2 minutos
    const interval = setInterval(fetchStreams, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStreamClick = (stream) => {
    window.open(stream.url, '_blank');
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitch':
        return '🎮';
      case 'youtube':
        return '📺';
      default:
        return '🔴';
    }
  };

  const formatViewerCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="live-streams-container">
        <h3 className="live-section-title">
          <span className="live-indicator">🔴</span> {t('home.live_streams')}
        </h3>
        <div className="loading-spinner">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="live-streams-container">
        <h3 className="live-section-title">
          <span className="live-indicator">🔴</span> {t('home.live_streams')}
        </h3>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="live-streams-container">
        <h3 className="live-section-title">
          <span className="live-indicator">🔴</span> {t('home.live_streams')}
        </h3>
        <div className="no-streams-message">
          {t('home.no_live_streams')}
        </div>
      </div>
    );
  }

  return (
    <div className="live-streams-container">
      <h3 className="live-section-title">
        <span className="live-indicator">🔴</span> {t('home.live_streams')}
      </h3>
      <div className="live-streams-grid">
        {streams.map((stream) => (
          <div 
            key={stream.id} 
            className="live-stream-card"
            onClick={() => handleStreamClick(stream)}
          >
            <div className="stream-thumbnail">
              <img src={stream.thumbnail} alt={stream.title} />
              <div className="stream-overlay">
                <span className="platform-icon">{getPlatformIcon(stream.platform)}</span>
                <span className="viewer-count">{formatViewerCount(stream.viewerCount)} {t('home.viewers')}</span>
              </div>
            </div>
            <div className="stream-info">
              <div className="stream-title">{stream.title}</div>
              <div className="stream-username">{stream.username}</div>
              <div className="stream-game">{stream.game}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveStreams; 