import React, { useState, useEffect } from 'react';
import aoeApi from '../services/aoeApi';

const Ranking = () => {
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
      const data = await aoeApi.getFsRanking(selectedLeaderboard, 0, 1000);
      setRankingData(data);
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
    let players = showOnlyFs ? rankingData.fsPlayers : rankingData.allPlayers;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      players = players.filter(player => {
        const name = formatPlayerName(player.name || player.profileName || '');
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
        <h1 className="page-title">🏆 Ranking do Clan</h1>
        <div className="card">
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⏳</div>
            <p>Carregando dados do ranking...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1 className="page-title">🏆 Ranking do Clan</h1>
        <div className="card">
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <div style={{fontSize: '2rem', marginBottom: '1rem'}}>❌</div>
            <p>{error}</p>
            <button className="btn" onClick={handleRefresh}>
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayPlayers = getDisplayPlayers();

  return (
    <div className="page-container">
      <h1 className="page-title">🏆 Ranking do Clan</h1>
      <p className="page-subtitle">
        Classificação dos nossos melhores guerreiros - Dados em tempo real
      </p>
      
      {/* Controles */}
      <div className="card">
        <h3>🎛️ Controles</h3>
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
          <div>
            <label style={{color: '#d4af37', marginRight: '0.5rem'}}>Tipo de Ranking:</label>
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
              <option value={3}>1v1 Random Map</option>
              <option value={4}>1v1 Empire Wars</option>
              <option value={13}>Team Random Map</option>
              <option value={14}>Team Empire Wars</option>
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
              Mostrar apenas Fs.
            </label>
          </div>
          
          <div>
            <input 
              type="text" 
              placeholder="Buscar jogador..."
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
            🔄 Atualizar
          </button>
        </div>
        
        {/* Aviso sobre dados mockados */}
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          color: '#ffc107'
        }}>
          <strong>⚠️ Aviso:</strong> Devido a restrições de CORS, estamos usando dados simulados para demonstração. 
          Quando o problema for resolvido, os dados reais da API do Age of Empires 2 DE serão carregados automaticamente.
        </div>
      </div>
      
      {/* Estatísticas */}
      <div className="card">
        <h3>📊 Estatísticas Gerais</h3>
        <p>
          <strong>Total de Jogadores:</strong> {rankingData.totalPlayers.toLocaleString()}<br/>
          <strong>Jogadores Fs.:</strong> {rankingData.totalFsPlayers}<br/>
          <strong>Mostrando:</strong> {displayPlayers.length} jogadores<br/>
          <strong>Tipo:</strong> {leaderboardNames[selectedLeaderboard]}
        </p>
      </div>
      
      {/* Tabela de Classificação */}
      <div className="card">
        <h3>🎯 Tabela de Classificação</h3>
        {displayPlayers.length === 0 ? (
          <p style={{textAlign: 'center', padding: '2rem', color: '#e0e0e0'}}>
            {searchTerm ? 'Nenhum jogador encontrado com esse nome.' : 'Nenhum jogador encontrado.'}
          </p>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #d4af37'}}>
                  <th style={{padding: '1rem', textAlign: 'left', color: '#d4af37'}}>Pos</th>
                  <th style={{padding: '1rem', textAlign: 'left', color: '#d4af37'}}>Jogador</th>
                  <th style={{padding: '1rem', textAlign: 'center', color: '#d4af37'}}>ELO</th>
                  <th style={{padding: '1rem', textAlign: 'center', color: '#d4af37'}}>Jogos</th>
                  <th style={{padding: '1rem', textAlign: 'center', color: '#d4af37'}}>Vitórias</th>
                  <th style={{padding: '1rem', textAlign: 'center', color: '#d4af37'}}>Taxa de Vitória</th>
                </tr>
              </thead>
              <tbody>
                {displayPlayers.map((player, index) => {
                  const isFsPlayer = (player.name || player.profileName || '').toLowerCase().includes('fs.');
                  const winRate = player.games > 0 ? ((player.wins / player.games) * 100).toFixed(1) : '0.0';
                  
                  return (
                    <tr 
                      key={player.profileId || index} 
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
                        {formatPlayerName(player.name || player.profileName)}
                        {isFsPlayer && <span style={{color: '#d4af37', marginLeft: '0.5rem'}}>👑</span>}
                      </td>
                      <td style={{padding: '1rem', textAlign: 'center', color: getEloColor(player.rating), fontWeight: 'bold'}}>
                        {player.rating || 'N/A'}
                      </td>
                      <td style={{padding: '1rem', textAlign: 'center', color: '#e0e0e0'}}>
                        {player.games || 'N/A'}
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
      <div className="card">
        <h3>🎖️ Destaques Fs.</h3>
        {rankingData.fsPlayers.length > 0 ? (
          <div>
            {rankingData.fsPlayers.slice(0, 3).map((player, index) => {
              const winRate = player.games > 0 ? ((player.wins / player.games) * 100).toFixed(1) : '0.0';
              return (
                <p key={player.profileId || index}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} 
                  <strong>{formatPlayerName(player.name || player.profileName)}</strong> - 
                  ELO: {player.rating || 'N/A'} | 
                  Jogos: {player.games || 'N/A'} | 
                  Taxa de Vitória: {winRate}%
                </p>
              );
            })}
          </div>
        ) : (
          <p>Nenhum jogador Fs. encontrado no ranking atual.</p>
        )}
      </div>
    </div>
  );
};

export default Ranking; 