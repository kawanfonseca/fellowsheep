import React, { useState } from 'react';

const Lobby = () => {
  const [activeLobbies] = useState([
    { id: 1, name: 'Arena Masters', host: 'SheepKing', players: 6, maxPlayers: 8, gameType: 'Ranked 1v1', map: 'Arena' },
    { id: 2, name: 'Clan War Training', host: 'WoolWarrior', players: 4, maxPlayers: 4, gameType: 'Team Game', map: 'Arabia' },
    { id: 3, name: 'Noobs Welcome', host: 'FlockCommander', players: 2, maxPlayers: 6, gameType: 'Unranked', map: 'Black Forest' },
    { id: 4, name: 'Fast Castle Practice', host: 'RamMaster', players: 3, maxPlayers: 4, gameType: 'Custom', map: 'Hideout' },
    { id: 5, name: 'Empire Wars', host: 'CastleBuilder', players: 5, maxPlayers: 6, gameType: 'Empire Wars', map: 'Nomad' },
  ]);

  const [selectedGameType, setSelectedGameType] = useState('all');
  const [newLobbyName, setNewLobbyName] = useState('');
  const [showCreateLobby, setShowCreateLobby] = useState(false);

  const filteredLobbies = selectedGameType === 'all' 
    ? activeLobbies 
    : activeLobbies.filter(lobby => lobby.gameType.toLowerCase().includes(selectedGameType.toLowerCase()));

  const getStatusColor = (players, maxPlayers) => {
    const ratio = players / maxPlayers;
    if (ratio >= 1) return '#ff6b6b';
    if (ratio >= 0.75) return '#ffd93d';
    return '#6bcf7f';
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🎮 Lobby & Matchmaking</h1>
      <p className="page-subtitle">
        Encontre parceiros para suas batalhas épicas
      </p>
      
      <div className="card">
        <h3>🎯 Matchmaking Rápido</h3>
        <p>Encontre uma partida rapidamente com base no seu nível:</p>
        <div style={{display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap'}}>
          <button className="btn">🔥 Ranked 1v1</button>
          <button className="btn">👥 Team Game</button>
          <button className="btn">⚡ Empire Wars</button>
          <button className="btn">🎲 Random Map</button>
        </div>
      </div>
      
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h3>🏛️ Salas Ativas</h3>
          <button 
            className="btn-secondary btn"
            onClick={() => setShowCreateLobby(!showCreateLobby)}
          >
            {showCreateLobby ? 'Cancelar' : 'Criar Sala'}
          </button>
        </div>
        
        {showCreateLobby && (
          <div style={{background: '#3a3a3a', padding: '1rem', borderRadius: '4px', marginBottom: '1rem'}}>
            <h4 style={{color: '#d4af37', marginBottom: '0.5rem'}}>Criar Nova Sala</h4>
            <input
              type="text"
              placeholder="Nome da sala"
              value={newLobbyName}
              onChange={(e) => setNewLobbyName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: '#2d2d2d',
                border: '1px solid #d4af37',
                borderRadius: '4px',
                color: '#e0e0e0',
                marginBottom: '1rem'
              }}
            />
            <div style={{display: 'flex', gap: '1rem'}}>
              <button className="btn">Criar Sala</button>
              <button className="btn-secondary btn">Cancelar</button>
            </div>
          </div>
        )}
        
        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap'}}>
          <select 
            value={selectedGameType} 
            onChange={(e) => setSelectedGameType(e.target.value)}
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
            <option value="custom">Custom</option>
          </select>
        </div>
        
        <div style={{display: 'grid', gap: '1rem'}}>
          {filteredLobbies.map((lobby) => (
            <div key={lobby.id} className="card" style={{background: '#3a3a3a'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <h4 style={{color: '#d4af37', marginBottom: '0.5rem'}}>{lobby.name}</h4>
                  <p style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>Host:</strong> {lobby.host} | <strong>Mapa:</strong> {lobby.map}
                  </p>
                  <p style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>Tipo:</strong> {lobby.gameType}
                  </p>
                  <p style={{color: getStatusColor(lobby.players, lobby.maxPlayers), fontWeight: 'bold'}}>
                    {lobby.players}/{lobby.maxPlayers} jogadores
                  </p>
                </div>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <button className="btn" style={{fontSize: '0.9rem'}}>
                    {lobby.players >= lobby.maxPlayers ? 'Assistir' : 'Entrar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h3>📋 Dicas para Matchmaking</h3>
        <p>
          • <strong>Comunique-se:</strong> Use o chat para coordenar estratégias<br/>
          • <strong>Seja respeitoso:</strong> Mantenha o fair play sempre<br/>
          • <strong>Pratique:</strong> Use partidas não ranqueadas para testar builds<br/>
          • <strong>Ajude iniciantes:</strong> Compartilhe seu conhecimento
        </p>
      </div>
    </div>
  );
};

export default Lobby; 