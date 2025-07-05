import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import liveService from '../services/liveService';

const LiveGames = () => {
  const { t } = useTranslation();
  const [liveGames, setLiveGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveGames = async () => {
      try {
        setLoading(true);
        const games = await liveService.getLiveGames();
        setLiveGames(games);
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
            <div className="game-players">
              <div className="player player1">
                <span className="player-name">{game.player1}</span>
                <span className="player-score">{game.score.split('-')[0]}</span>
              </div>
              <div className="vs-indicator">VS</div>
              <div className="player player2">
                <span className="player-name">{game.player2}</span>
                <span className="player-score">{game.score.split('-')[1]}</span>
              </div>
            </div>
            <div className="game-map">
              <span className="map-label">{t('home.map')}:</span>
              <span className="map-name">{game.map}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveGames; 