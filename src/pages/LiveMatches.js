import React, { useState, useEffect } from 'react';

const LiveMatches = () => {
  const [liveMatches, setLiveMatches] = useState([
    {
      id: 1,
      players: ['SheepKing', 'WoolWarrior'],
      currentTime: '23:45',
      map: 'Arabia',
      gameType: 'Ranked 1v1',
      status: 'Imperial Age',
      spectators: 12,
      isLive: true
    },
    {
      id: 2,
      players: ['FlockCommander', 'RamMaster', 'CastleBuilder', 'SiegeExpert'],
      currentTime: '31:22',
      map: 'Team Islands',
      gameType: 'Team Game',
      status: 'Castle Age',
      spectators: 8,
      isLive: true
    },
    {
      id: 3,
      players: ['ArcherQueen', 'KnightRider'],
      currentTime: '18:33',
      map: 'Arena',
      gameType: 'Ranked 1v1',
      status: 'Castle Age',
      spectators: 5,
      isLive: true
    }
  ]);

  const [onlineMembers] = useState([
    { name: 'SheepKing', status: 'Em Partida', activity: 'Ranked 1v1' },
    { name: 'WoolWarrior', status: 'Em Partida', activity: 'Ranked 1v1' },
    { name: 'FlockCommander', status: 'Em Partida', activity: 'Team Game' },
    { name: 'RamMaster', status: 'Em Partida', activity: 'Team Game' },
    { name: 'CastleBuilder', status: 'Em Partida', activity: 'Team Game' },
    { name: 'SiegeExpert', status: 'Em Partida', activity: 'Team Game' },
    { name: 'ArcherQueen', status: 'Em Partida', activity: 'Ranked 1v1' },
    { name: 'KnightRider', status: 'Em Partida', activity: 'Ranked 1v1' },
    { name: 'VillagerPro', status: 'Online', activity: 'Navegando' },
    { name: 'TowerRush', status: 'Online', activity: 'Lobby' },
    { name: 'BuildOrderMaster', status: 'Online', activity: 'Treino' },
    { name: 'EcoBoomer', status: 'Online', activity: 'Assistindo' }
  ]);

  // Simular atualização do tempo das partidas
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMatches(prev => prev.map(match => {
        if (match.isLive) {
          const [minutes, seconds] = match.currentTime.split(':').map(Number);
          const totalSeconds = minutes * 60 + seconds + 1;
          const newMinutes = Math.floor(totalSeconds / 60);
          const newSeconds = totalSeconds % 60;
          return {
            ...match,
            currentTime: `${newMinutes}:${newSeconds.toString().padStart(2, '0')}`
          };
        }
        return match;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    if (status === 'Em Partida') return '#ff6b6b';
    if (status === 'Online') return '#6bcf7f';
    return '#ffd93d';
  };

  const getAgeColor = (status) => {
    if (status.includes('Imperial')) return '#ff6b6b';
    if (status.includes('Castle')) return '#ffd93d';
    if (status.includes('Feudal')) return '#74c0fc';
    return '#6bcf7f';
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🔴 Partidas Ao Vivo</h1>
      <p className="page-subtitle">
        Acompanhe as batalhas épicas acontecendo agora
      </p>
      
      <div className="card">
        <h3>📡 Status do Servidor</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#6bcf7f', fontWeight: 'bold'}}>🟢</div>
            <div style={{color: '#e0e0e0'}}>Online</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#d4af37', fontWeight: 'bold'}}>{onlineMembers.length}</div>
            <div style={{color: '#e0e0e0'}}>Membros Conectados</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#ff6b6b', fontWeight: 'bold'}}>{liveMatches.length}</div>
            <div style={{color: '#e0e0e0'}}>Partidas Ativas</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#74c0fc', fontWeight: 'bold'}}>
              {liveMatches.reduce((sum, match) => sum + match.spectators, 0)}
            </div>
            <div style={{color: '#e0e0e0'}}>Espectadores</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3>🎮 Partidas em Andamento</h3>
        <div style={{display: 'grid', gap: '1rem'}}>
          {liveMatches.map((match) => (
            <div key={match.id} className="card" style={{background: '#3a3a3a', border: '2px solid #ff6b6b'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem'}}>
                    <span style={{color: '#ff6b6b', fontWeight: 'bold', fontSize: '1.1rem'}}>
                      🔴 AO VIVO
                    </span>
                    <span style={{color: '#e0e0e0', fontWeight: 'bold'}}>
                      {match.currentTime}
                    </span>
                    <span style={{color: getAgeColor(match.status), fontWeight: 'bold'}}>
                      {match.status}
                    </span>
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>Jogadores:</strong> {match.players.join(' vs ')}
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>Mapa:</strong> {match.map} | <strong>Tipo:</strong> {match.gameType}
                  </div>
                  <div style={{color: '#888', fontSize: '0.9rem'}}>
                    👥 {match.spectators} espectadores assistindo
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  <button className="btn" style={{fontSize: '0.9rem'}}>
                    Assistir
                  </button>
                  <button className="btn-secondary btn" style={{fontSize: '0.9rem'}}>
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h3>👥 Membros Online</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem'}}>
          {onlineMembers.map((member, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem',
              background: '#3a3a3a',
              borderRadius: '4px',
              border: '1px solid #444'
            }}>
              <div>
                <div style={{color: '#e0e0e0', fontWeight: 'bold'}}>{member.name}</div>
                <div style={{color: '#888', fontSize: '0.9rem'}}>{member.activity}</div>
              </div>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: getStatusColor(member.status)
              }}></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h3>📺 Streaming e Transmissões</h3>
        <p>
          🎬 <strong>SheepKing</strong> - Transmitindo no Twitch (234 viewers)<br/>
          📹 <strong>WoolWarrior</strong> - Gravando para YouTube<br/>
          🎥 <strong>FlockCommander</strong> - Tutorial ao vivo no Discord<br/>
          📸 <strong>RamMaster</strong> - Compartilhando no Instagram Stories
        </p>
        <button className="btn" style={{marginTop: '1rem'}}>
          Ver Todas as Transmissões
        </button>
      </div>
    </div>
  );
};

export default LiveMatches; 