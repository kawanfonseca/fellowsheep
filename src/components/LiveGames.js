import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import liveService from '../services/liveService';

const LiveGames = () => {
  const { t } = useTranslation();
  const [liveGames, setLiveGames] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveGames = async () => {
      try {
        setLoading(true);
        const { live, recent } = await liveService.getLiveAndRecentGames();
        setLiveGames(live);
        setRecentGames(recent);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar jogos ao vivo');
        console.error('Erro ao buscar jogos ao vivo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveGames();

    // Atualizar a cada 2 minutos
    const interval = setInterval(fetchLiveGames, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="live-games-container">
        <h3 className="live-section-title">
          <span className="live-indicator">🔴</span> {t('home.live_games')}
        </h3>
        <div className="loading-spinner">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="live-games-container">
        <h3 className="live-section-title">
          <span className="live-indicator">🔴</span> {t('home.live_games')}
        </h3>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (liveGames.length === 0) {
    return (
      <div className="live-games-container">
        <h3 className="live-section-title">
          <span className="live-indicator">🔴</span> {t('home.live_games')}
        </h3>
        <div className="no-games-message">
          {t('home.no_live_games')}
        </div>
      </div>
    );
  }

  return (
    <div className="live-games-container">
      <h3 className="live-section-title">
        <span className="live-indicator">🔴</span> {t('home.live_games')}
      </h3>
      <div className="live-games-grid">
        {liveGames.map((game) => (
          <div key={game.id} className="live-game-card">
            <div className="game-header">
              <span className="game-type">{game.gameType}</span>
              <span className="game-time">{liveService.formatGameTime(game.startTime)}</span>
            </div>
            <div className="game-map" style={{marginTop: '0.25rem'}}>
              <span className="map-label">{t('home.map')}:</span>
              <span className="map-name">{game.map}</span>
            </div>
            <div className="game-players" style={{display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', marginTop: '0.5rem'}}>
              <div className="player-list">
                {(game.team0 || []).map((p, idx) => (
                  <div key={idx} className="player-row">{p}</div>
                ))}
              </div>
              <div className="vs-indicator" style={{alignSelf: 'center'}}>VS</div>
              <div className="player-list" style={{textAlign: 'right'}}>
                {(game.team1 || []).map((p, idx) => (
                  <div key={idx} className="player-row">{p}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {recentGames.length > 0 && (
        <div style={{marginTop: '1.5rem'}}>
          <h3 className="live-section-title">{t('home.recent_matches') || 'Partidas Recentes'}</h3>
          <div className="live-games-grid">
            {recentGames.map((game) => (
              <div key={`recent-${game.id}`} className="live-game-card">
                <div className="game-header">
                  <span className="game-type">{game.gameType}</span>
                </div>
                <div className="game-map" style={{marginTop: '0.25rem'}}>
                  <span className="map-label">{t('home.map')}:</span>
                  <span className="map-name">{game.map}</span>
                </div>
                <div className="game-players" style={{display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', marginTop: '0.5rem'}}>
                  <div className="player-list">
                    {(game.team0 || []).map((p, idx) => (
                      <div key={idx} className="player-row">{p}</div>
                    ))}
                  </div>
                  <div className="vs-indicator" style={{alignSelf: 'center'}}>VS</div>
                  <div className="player-list" style={{textAlign: 'right'}}>
                    {(game.team1 || []).map((p, idx) => (
                      <div key={idx} className="player-row">{p}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveGames; 