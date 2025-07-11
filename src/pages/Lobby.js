import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Lobby = () => {
  const { t } = useTranslation();
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
      <h1 className="page-title">{t('lobby.title')}</h1>
      <p className="page-subtitle">
        {t('lobby.subtitle')}
      </p>
      
      <div className="card">
        <h3>{t('lobby.quick_matchmaking')}</h3>
        <p>{t('lobby.quick_matchmaking_desc')}</p>
        <div style={{display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap'}}>
          <button className="btn">{t('lobby.ranked_1v1')}</button>
          <button className="btn">{t('lobby.team_game')}</button>
          <button className="btn">{t('lobby.empire_wars')}</button>
          <button className="btn">{t('lobby.random_map')}</button>
        </div>
      </div>
      
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h3>{t('lobby.active_rooms_title')}</h3>
          <button 
            className="btn-secondary btn"
            onClick={() => setShowCreateLobby(!showCreateLobby)}
          >
            {showCreateLobby ? t('lobby.cancel') : t('lobby.create_room')}
          </button>
        </div>
        
        {showCreateLobby && (
          <div style={{background: '#3a3a3a', padding: '1rem', borderRadius: '4px', marginBottom: '1rem'}}>
            <h4 style={{color: '#d4af37', marginBottom: '0.5rem'}}>{t('lobby.create_new_room')}</h4>
            <input
              type="text"
              placeholder={t('lobby.room_name')}
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
              <button className="btn">{t('lobby.create_room')}</button>
              <button className="btn-secondary btn">{t('lobby.cancel')}</button>
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
            <option value="all">{t('lobby.all_types')}</option>
            <option value="ranked">{t('lobby.ranked')}</option>
            <option value="team">{t('lobby.team')}</option>
            <option value="unranked">{t('lobby.unranked')}</option>
            <option value="custom">{t('lobby.custom')}</option>
          </select>
        </div>
        
        <div style={{display: 'grid', gap: '1rem'}}>
          {filteredLobbies.map((lobby) => (
            <div key={lobby.id} className="card" style={{background: '#3a3a3a'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <h4 style={{color: '#d4af37', marginBottom: '0.5rem'}}>{lobby.name}</h4>
                  <p style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>{t('lobby.host')}</strong> {lobby.host} | <strong>{t('lobby.map')}</strong> {lobby.map}
                  </p>
                  <p style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>{t('lobby.type')}</strong> {lobby.gameType}
                  </p>
                  <p style={{color: getStatusColor(lobby.players, lobby.maxPlayers), fontWeight: 'bold'}}>
                    {lobby.players}/{lobby.maxPlayers} {t('lobby.players')}
                  </p>
                </div>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <button className="btn" style={{fontSize: '0.9rem'}}>
                    {lobby.players >= lobby.maxPlayers ? t('lobby.watch') : t('lobby.enter')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h3>{t('lobby.matchmaking_tips')}</h3>
        <p>
          • <strong>{t('lobby.tip_communicate')}</strong> {t('lobby.tip_communicate_desc')}<br/>
          • <strong>{t('lobby.tip_respectful')}</strong> {t('lobby.tip_respectful_desc')}<br/>
          • <strong>{t('lobby.tip_practice')}</strong> {t('lobby.tip_practice_desc')}<br/>
          • <strong>{t('lobby.tip_help')}</strong> {t('lobby.tip_help_desc')}
        </p>
      </div>
    </div>
  );
};

export default Lobby; 