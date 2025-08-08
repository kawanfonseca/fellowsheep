import React, { useState, useEffect } from 'react';
import aoeApi from '../services/aoeApi';
import { useTranslation } from 'react-i18next';

const Ranking = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rankingData, setRankingData] = useState({
    allPlayers: [],
    fsPlayers: [],
    totalFsPlayers: 0,
    totalPlayers: 0
  });
  const [selectedLeaderboard, setSelectedLeaderboard] = useState(3); // 1v1 por padrão
  const [showOnlyFs, setShowOnlyFs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [leaderboards, setLeaderboards] = useState([]);
  const [activeTab, setActiveTab] = useState('geral'); // 'clan' ou 'geral'

  // Mapeamento de IDs de leaderboard para nomes
  const leaderboardNames = {
    3: '1v1 Random Map',
    4: '1v1 Empire Wars',
    13: 'Team Random Map',
    14: 'Team Empire Wars'
  };

  useEffect(() => {
    loadLeaderboards();
  }, []);

  useEffect(() => {
    loadRankingData();
  }, [selectedLeaderboard]);

  // Garantir que na aba Geral apenas 1v1 (id=3) seja usado
  useEffect(() => {
    if (activeTab === 'geral' && selectedLeaderboard !== 3) {
      setSelectedLeaderboard(3);
    }
  }, [activeTab]);

  const loadLeaderboards = async () => {
    try {
      const data = await aoeApi.getAvailableLeaderboards();
      setLeaderboards(data);
    } catch (error) {
      console.error('Erro ao carregar leaderboards:', error);
    }
  };

  const loadRankingData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar SEMPRE os dois rankings para garantir dados prontos ao alternar abas
      const [general, fsData] = await Promise.all([
        aoeApi.getLeaderboard(3, 0, 100),
        aoeApi.getFsRanking(selectedLeaderboard, 0, 1000),
      ]);

      setRankingData({
        allPlayers: general,
        fsPlayers: fsData.fsPlayers,
        totalFsPlayers: fsData.totalFsPlayers,
        totalPlayers: general.length,
      });
    } catch (error) {
      setError('Erro ao carregar dados do ranking. Tente novamente.');
      console.error('Erro ao carregar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEloColor = (elo) => {
    if (elo >= 1800) return '#ff6b6b'; // Vermelho - Elite
    if (elo >= 1600) return '#ffd93d'; // Amarelo - Alto
    if (elo >= 1400) return '#6bcf7f'; // Verde - Médio
    return '#74c0fc'; // Azul - Baixo
  };

  const formatPlayerName = (name) => {
    if (!name) return 'Nome Desconhecido';
    return name.replace(/\[.*?\]/g, '').trim(); // Remove tags de clan
  };

  const getDisplayPlayers = () => {
    let players = activeTab === 'clan' ? rankingData.fsPlayers : rankingData.allPlayers;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      players = players.filter(player => {
        const name = formatPlayerName(player.nickname || '');
        return name.toLowerCase().includes(searchLower);
      });
    }
    
    return players.slice(0, 100); // Limitar a 100 jogadores para performance
  };

  const handleRefresh = () => {
    aoeApi.clearCache();
    loadRankingData();
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">{t('ranking.title')}</h1>
        <div className="card">
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⏳</div>
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1 className="page-title">{t('ranking.title')}</h1>
        <div className="card">
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>❌</div>
            <p>{error}</p>
            <button className="btn" onClick={handleRefresh}>
              {t('ranking.refresh')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayPlayers = getDisplayPlayers();

  return (
    <div className="page-container">
      <h1 className="page-title">{t('ranking.title')}</h1>
      <p className="page-subtitle">{t('ranking.subtitle')}</p>
      
      {/* Abas para alternar entre Clan e Geral */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button
          className={`btn ${activeTab === 'clan' ? 'active' : ''}`}
          style={{ background: activeTab === 'clan' ? '#d4af37' : '#222', color: activeTab === 'clan' ? '#222' : '#d4af37', fontWeight: 'bold', borderRadius: 8, padding: '0.5rem 1.5rem', border: 'none', cursor: 'pointer' }}
          onClick={() => setActiveTab('clan')}
        >
          {t('ranking.tab_clan')}
        </button>
        <button
          className={`btn ${activeTab === 'geral' ? 'active' : ''}`}
          style={{ background: activeTab === 'geral' ? '#d4af37' : '#222', color: activeTab === 'geral' ? '#222' : '#d4af37', fontWeight: 'bold', borderRadius: 8, padding: '0.5rem 1.5rem', border: 'none', cursor: 'pointer' }}
          onClick={() => setActiveTab('geral')}
        >
          {t('ranking.tab_geral')}
        </button>
      </div>
      
      {/* Controles */}
      <div className="card">
        <h3>{t('ranking.controls')}</h3>
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
          <div>
            <label style={{color: '#d4af37', marginRight: '0.5rem'}}>{t('ranking.type_label')}</label>
            <select 
              value={selectedLeaderboard} 
              onChange={(e) => setSelectedLeaderboard(Number(e.target.value))}
              style={{
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid #d4af37',
                background: '#2d2d2d',
                color: '#e0e0e0'
              }}
            >
              <option value={3}>{leaderboardNames[3]}</option>
              <option value={4} disabled={activeTab === 'geral'}>{leaderboardNames[4]}</option>
              <option value={13} disabled={activeTab === 'geral'}>{leaderboardNames[13]}</option>
              <option value={14} disabled={activeTab === 'geral'}>{leaderboardNames[14]}</option>
            </select>
          </div>
          
          <div>
            <label style={{color: '#d4af37', marginRight: '0.5rem'}}>
              <input 
                type="checkbox" 
                checked={showOnlyFs} 
                onChange={(e) => setShowOnlyFs(e.target.checked)}
                style={{marginRight: '0.5rem'}}
              />
              {t('ranking.show_fs')}
            </label>
          </div>
          
          <div>
            <input 
              type="text" 
              placeholder={t('ranking.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid #d4af37',
                background: '#2d2d2d',
                color: '#e0e0e0',
                minWidth: '200px'
              }}
            />
          </div>
          
          <button className="btn" onClick={handleRefresh}>
            {t('ranking.refresh')}
          </button>
        </div>
        

      </div>
      
      {/* Estatísticas */}
      <div className="card">
        <h3>{t('ranking.stats_title')}</h3>
        <p>
          <strong>{t('ranking.total_players')}</strong> {activeTab === 'clan' ? rankingData.totalFsPlayers : rankingData.totalPlayers}<br/>
          <strong>{t('ranking.showing')}</strong> {displayPlayers.length} {t('ranking.player')}<br/>
          <strong>{t('ranking.type')}</strong> {leaderboardNames[selectedLeaderboard]}
        </p>
      </div>
      
      {/* Tabela de Classificação */}
      <div className="card">
        <h3>{t('ranking.table_title')}</h3>
        {displayPlayers.length === 0 ? (
          <p style={{textAlign: 'center', padding: '2rem', color: '#e0e0e0'}}>
            {searchTerm ? t('ranking.no_players_search') : t('ranking.no_players')}
          </p>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #d4af37'}}>
                  <th style={{padding: '1rem', textAlign: 'left', color: '#d4af37'}}>{t('ranking.pos')}</th>
                  <th style={{padding: '1rem', textAlign: 'left', color: '#d4af37'}}>{t('ranking.player')}</th>
                  <th style={{padding: '1rem', textAlign: 'center', color: '#d4af37'}}>{t('ranking.elo')}</th>
                  <th style={{padding: '1rem', textAlign: 'center', color: '#d4af37'}}>{t('ranking.games')}</th>
                  <th style={{padding: '1rem', textAlign: 'center', color: '#d4af37'}}>{t('ranking.wins')}</th>
                  <th style={{padding: '1rem', textAlign: 'center', color: '#d4af37'}}>{t('ranking.winrate')}</th>
                </tr>
              </thead>
              <tbody>
                {displayPlayers.map((player, index) => {
                  const isFsPlayer = (player.nickname || '').toLowerCase().includes('fs.');
                   const totalGames = (player.wins || 0) + (player.losses || 0);
                   const winRate = totalGames > 0 ? ((player.wins / totalGames) * 100).toFixed(1) : '0.0';
                  
                  return (
                    <tr 
                      key={index} 
                      style={{
                        borderBottom: '1px solid #444',
                        backgroundColor: isFsPlayer ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
                      }}
                    >
                      <td style={{padding: '1rem', color: '#e0e0e0'}}>
                        {index + 1 <= 3 ? (
                          <span style={{fontSize: '1.5rem'}}>
                            {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          index + 1
                        )}
                      </td>
                      <td style={{padding: '1rem', color: '#e0e0e0', fontWeight: 'bold'}}>
                        {formatPlayerName(player.nickname)}
                        {isFsPlayer && <span style={{color: '#d4af37', marginLeft: '0.5rem'}}>👑</span>}
                      </td>
                      <td style={{padding: '1rem', textAlign: 'center', color: getEloColor(player.rating), fontWeight: 'bold'}}>
                        {player.rating || 'N/A'}
                      </td>
                      <td style={{padding: '1rem', textAlign: 'center', color: '#e0e0e0'}}>
                        {totalGames || 'N/A'}
                      </td>
                      <td style={{padding: '1rem', textAlign: 'center', color: '#e0e0e0'}}>
                        {player.wins || 'N/A'}
                      </td>
                      <td style={{padding: '1rem', textAlign: 'center', color: '#e0e0e0'}}>
                        {winRate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Conquistas */}
      {activeTab === 'clan' && (
        <div className="card">
          <h3>{t('ranking.highlights')}</h3>
          {rankingData.fsPlayers.length > 0 ? (
            <div>
              {rankingData.fsPlayers.slice(0, 3).map((player, index) => {
                const winRate = (player.wins + player.losses) > 0 ? ((player.wins / (player.wins + player.losses)) * 100).toFixed(1) : '0.0';
                return (
                  <p key={index}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} 
                    <strong>{formatPlayerName(player.nickname)}</strong> - 
                    ELO: {player.rating || 'N/A'}{" | "}
                    {t('ranking.games')}: {(player.wins + player.losses) || 'N/A'}{" | "}
                    {t('ranking.winrate')}: {winRate}%
                  </p>
                );
              })}
            </div>
          ) : (
            <p>{t('ranking.no_fs')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Ranking; 