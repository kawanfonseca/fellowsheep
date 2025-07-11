import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const RecentMatches = () => {
  const { t } = useTranslation();
  const [recentMatches] = useState([
    {
      id: 1,
      players: ['SheepKing', 'WoolWarrior'],
      result: 'Vitória',
      duration: '32:15',
      map: 'Arabia',
      date: '2025-01-05 14:30',
      gameType: 'Ranked 1v1',
      eloChange: '+12'
    },
    {
      id: 2,
      players: ['FlockCommander', 'RamMaster', 'CastleBuilder', 'SiegeExpert'],
      result: 'Vitória',
      duration: '45:22',
      map: 'Team Islands',
      date: '2025-01-05 13:15',
      gameType: 'Team Game',
      eloChange: '+8'
    },
    {
      id: 3,
      players: ['ArcherQueen', 'KnightRider'],
      result: 'Derrota',
      duration: '28:45',
      map: 'Arena',
      date: '2025-01-05 11:00',
      gameType: 'Ranked 1v1',
      eloChange: '-9'
    },
    {
      id: 4,
      players: ['VillagerPro', 'TowerRush'],
      result: 'Vitória',
      duration: '19:33',
      map: 'Black Forest',
      date: '2025-01-05 10:15',
      gameType: 'Unranked',
      eloChange: '0'
    },
    {
      id: 5,
      players: ['SheepKing', 'FlockCommander', 'WoolWarrior', 'RamMaster'],
      result: 'Vitória',
      duration: '67:12',
      map: 'Nomad',
      date: '2025-01-04 20:45',
      gameType: 'Team Game',
      eloChange: '+15'
    }
  ]);

  const [filterType, setFilterType] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState('all');

  const allPlayers = [...new Set(recentMatches.flatMap(match => match.players))];

  const filteredMatches = recentMatches.filter(match => {
    const typeMatch = filterType === 'all' || match.gameType.toLowerCase().includes(filterType.toLowerCase());
    const playerMatch = selectedPlayer === 'all' || match.players.includes(selectedPlayer);
    return typeMatch && playerMatch;
  });

  const getResultColor = (result) => {
    if (result === 'Vitória') return '#6bcf7f';
    if (result === 'Derrota') return '#ff6b6b';
    return '#ffd93d';
  };

  const getEloColor = (eloChange) => {
    if (eloChange.includes('+')) return '#6bcf7f';
    if (eloChange.includes('-')) return '#ff6b6b';
    return '#ffd93d';
  };

  return (
    <div className="page-container">
      <h1 className="page-title">{t('recent_matches.title')}</h1>
      <p className="page-subtitle">
        {t('recent_matches.subtitle')}
      </p>
      
      <div className="card">
        <h3>{t('recent_matches.stats_24h')}</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#d4af37', fontWeight: 'bold'}}>23</div>
            <div style={{color: '#e0e0e0'}}>{t('recent_matches.matches_played')}</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#6bcf7f', fontWeight: 'bold'}}>67%</div>
            <div style={{color: '#e0e0e0'}}>{t('recent_matches.win_rate')}</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#ffd93d', fontWeight: 'bold'}}>38min</div>
            <div style={{color: '#e0e0e0'}}>{t('recent_matches.avg_duration')}</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#74c0fc', fontWeight: 'bold'}}>+127</div>
            <div style={{color: '#e0e0e0'}}>{t('recent_matches.total_elo_gained')}</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h3>🎮 Histórico de Partidas</h3>
          <div style={{display: 'flex', gap: '1rem'}}>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '0.5rem',
                background: '#2d2d2d',
                border: '1px solid #d4af37',
                borderRadius: '4px',
                color: '#e0e0e0'
              }}
            >
              <option value="all">Todos os Tipos</option>
              <option value="ranked">Ranked</option>
              <option value="team">Team Game</option>
              <option value="unranked">Unranked</option>
            </select>
            <select 
              value={selectedPlayer} 
              onChange={(e) => setSelectedPlayer(e.target.value)}
              style={{
                padding: '0.5rem',
                background: '#2d2d2d',
                border: '1px solid #d4af37',
                borderRadius: '4px',
                color: '#e0e0e0'
              }}
            >
              <option value="all">Todos os Jogadores</option>
              {allPlayers.map(player => (
                <option key={player} value={player}>{player}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={{display: 'grid', gap: '1rem'}}>
          {filteredMatches.map((match) => (
            <div key={match.id} className="card" style={{background: '#3a3a3a'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', gap: '1rem', marginBottom: '0.5rem'}}>
                    <span style={{color: getResultColor(match.result), fontWeight: 'bold', fontSize: '1.1rem'}}>
                      {match.result}
                    </span>
                    <span style={{color: '#e0e0e0'}}>
                      {match.gameType}
                    </span>
                    <span style={{color: getEloColor(match.eloChange), fontWeight: 'bold'}}>
                      {match.eloChange !== '0' ? match.eloChange : 'Sem ELO'}
                    </span>
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>Jogadores:</strong> {match.players.join(', ')}
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>Mapa:</strong> {match.map} | <strong>Duração:</strong> {match.duration}
                  </div>
                  <div style={{color: '#888', fontSize: '0.9rem'}}>
                    {new Date(match.date).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div>
                  <button className="btn-secondary btn" style={{fontSize: '0.9rem'}}>
                    Ver Replay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h3>🏆 Destaques da Semana</h3>
        <p>
          🎯 <strong>Partida mais longa:</strong> SheepKing vs WoolWarrior - 67:12 em Nomad<br/>
          ⚡ <strong>Vitória mais rápida:</strong> VillagerPro - 19:33 em Black Forest<br/>
          🔥 <strong>Maior sequência:</strong> FlockCommander - 8 vitórias consecutivas<br/>
          📈 <strong>Maior ganho de ELO:</strong> RamMaster - +15 pontos em uma partida
        </p>
      </div>
    </div>
  );
};

export default RecentMatches; 