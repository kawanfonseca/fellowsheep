import React, { useState } from 'react';

const Discord = () => {
  const [discordStats] = useState({
    totalMembers: 89,
    onlineMembers: 34,
    channels: 15,
    roles: 8,
    boosts: 3
  });

  const [channels] = useState([
    {
      category: '📢 Informações',
      channels: [
        { name: 'regras', description: 'Regras do servidor e do clan' },
        { name: 'anúncios', description: 'Novidades e comunicados importantes' },
        { name: 'eventos', description: 'Torneios e eventos organizados' }
      ]
    },
    {
      category: '💬 Conversa Geral',
      channels: [
        { name: 'chat-geral', description: 'Conversa livre sobre qualquer assunto' },
        { name: 'memes', description: 'Memes e humor sobre AoE2' },
        { name: 'screenshots', description: 'Compartilhe seus melhores momentos' }
      ]
    },
    {
      category: '🎮 Age of Empires 2',
      channels: [
        { name: 'procurar-partida', description: 'Encontre parceiros para jogar' },
        { name: 'estratégias', description: 'Discussão sobre táticas e builds' },
        { name: 'resultados', description: 'Compartilhe vitórias e derrotas' },
        { name: 'dúvidas', description: 'Tire dúvidas sobre o jogo' }
      ]
    },
    {
      category: '🎓 Aprendizado',
      channels: [
        { name: 'coaching', description: 'Agende sessões de coaching' },
        { name: 'tutoriais', description: 'Guias e tutoriais' },
        { name: 'análise-replays', description: 'Análise de replays' }
      ]
    },
    {
      category: '🔊 Canais de Voz',
      channels: [
        { name: 'Sala Principal', description: 'Conversa geral por voz' },
        { name: 'Coaching', description: 'Sessões de coaching privadas' },
        { name: 'Partidas 1v1', description: 'Para partidas individuais' },
        { name: 'Team Games', description: 'Para jogos em equipe' }
      ]
    }
  ]);

  const [roles] = useState([
    { name: 'Líder', color: '#ff6b6b', members: 2, description: 'Líderes do clan' },
    { name: 'Oficial', color: '#ffd93d', members: 5, description: 'Oficiais e moderadores' },
    { name: 'Veterano', color: '#d4af37', members: 12, description: 'Membros experientes' },
    { name: 'Membro', color: '#6bcf7f', members: 45, description: 'Membros regulares' },
    { name: 'Novato', color: '#74c0fc', members: 18, description: 'Novos membros' },
    { name: 'Coach', color: '#ff8cc8', members: 7, description: 'Mentores e coaches' }
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div className="page-container">
      <h1 className="page-title">💬 Discord - Fellowsheep Gaming</h1>
      <p className="page-subtitle">
        Nosso centro de comunicação e comunidade
      </p>
      
      <div className="card">
        <h3>📊 Estatísticas do Servidor</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#d4af37', fontWeight: 'bold'}}>{discordStats.totalMembers}</div>
            <div style={{color: '#e0e0e0'}}>Membros Total</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#6bcf7f', fontWeight: 'bold'}}>{discordStats.onlineMembers}</div>
            <div style={{color: '#e0e0e0'}}>Online Agora</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#74c0fc', fontWeight: 'bold'}}>{discordStats.channels}</div>
            <div style={{color: '#e0e0e0'}}>Canais</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#ff6b6b', fontWeight: 'bold'}}>{discordStats.boosts}</div>
            <div style={{color: '#e0e0e0'}}>Boosts</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h3>🚀 Junte-se ao Nosso Discord</h3>
          <button 
            className="btn" 
            onClick={() => setShowInviteModal(true)}
            style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
          >
            <span>💬</span> Entrar no Discord
          </button>
        </div>
        
        <p style={{color: '#e0e0e0', marginBottom: '1rem'}}>
          Nosso servidor Discord é o coração da comunidade Fellowsheep Gaming. Aqui você encontrará:
        </p>
        
        <div style={{color: '#e0e0e0'}}>
          ✅ <strong>Comunicação em tempo real</strong> - Chat de texto e voz<br/>
          ✅ <strong>Organização de partidas</strong> - Encontre parceiros facilmente<br/>
          ✅ <strong>Coaching gratuito</strong> - Aprenda com nossos melhores jogadores<br/>
          ✅ <strong>Eventos regulares</strong> - Torneios e competições<br/>
          ✅ <strong>Comunidade ativa</strong> - Mais de 80 membros ativos
        </div>
      </div>
      
      <div className="card">
        <h3>📋 Estrutura de Canais</h3>
        <div style={{display: 'grid', gap: '1rem'}}>
          {channels.map((category, index) => (
            <div key={index} className="card" style={{background: '#3a3a3a'}}>
              <h4 style={{color: '#d4af37', marginBottom: '0.5rem'}}>{category.category}</h4>
              <div style={{display: 'grid', gap: '0.5rem'}}>
                {category.channels.map((channel, channelIndex) => (
                  <div key={channelIndex} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem',
                    background: '#2d2d2d',
                    borderRadius: '4px',
                    border: '1px solid #444'
                  }}>
                    <div>
                      <div style={{color: '#e0e0e0', fontWeight: 'bold'}}>
                        #{channel.name}
                      </div>
                      <div style={{color: '#888', fontSize: '0.9rem'}}>
                        {channel.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h3>👥 Sistema de Cargos</h3>
        <div style={{display: 'grid', gap: '0.5rem'}}>
          {roles.map((role, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              background: '#3a3a3a',
              borderRadius: '4px',
              border: '1px solid #444'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: role.color
                }}></div>
                <div>
                  <div style={{color: role.color, fontWeight: 'bold'}}>
                    {role.name}
                  </div>
                  <div style={{color: '#888', fontSize: '0.9rem'}}>
                    {role.description}
                  </div>
                </div>
              </div>
              <div style={{color: '#e0e0e0', fontWeight: 'bold'}}>
                {role.members} membros
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showInviteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{
            background: '#2d2d2d',
            border: '2px solid #d4af37',
            maxWidth: '500px',
            width: '90%'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h3>💬 Convite para o Discord</h3>
              <button 
                onClick={() => setShowInviteModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e0e0e0',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <p style={{color: '#e0e0e0', marginBottom: '1rem'}}>
              Você está prestes a entrar no servidor Discord do Fellowsheep Gaming!
            </p>
            
            <div style={{
              background: '#3a3a3a',
              padding: '1rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              <div style={{color: '#d4af37', fontWeight: 'bold', fontSize: '1.2rem'}}>
                discord.gg/fellowsheep
              </div>
              <div style={{color: '#888', fontSize: '0.9rem', marginTop: '0.5rem'}}>
                Link permanente do servidor
              </div>
            </div>
            
            <div style={{color: '#e0e0e0', marginBottom: '1rem', fontSize: '0.9rem'}}>
              📋 <strong>Regras importantes:</strong><br/>
              • Seja respeitoso com todos os membros<br/>
              • Não spam ou flood nos canais<br/>
              • Use os canais apropriados para cada assunto<br/>
              • Divirta-se e ajude a comunidade a crescer!
            </div>
            
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
              <button 
                className="btn"
                onClick={() => {
                  window.open('https://discord.gg/fellowsheep', '_blank');
                  setShowInviteModal(false);
                }}
              >
                Entrar no Discord
              </button>
              <button 
                className="btn-secondary btn"
                onClick={() => setShowInviteModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="card">
        <h3>🎮 Atividades Recentes</h3>
        <p>
          🏆 <strong>Torneio Interno:</strong> Inscrições abertas até 15/01<br/>
          🎓 <strong>Sessão de Coaching:</strong> Hoje às 20h no canal de voz<br/>
          📺 <strong>Stream do SheepKing:</strong> Ao vivo agora no canal #streams<br/>
          🎯 <strong>Partida Clan War:</strong> Domingo às 19h, confirmem presença<br/>
          📊 <strong>Ranking Atualizado:</strong> Novos ELOs postados em #anúncios
        </p>
      </div>
    </div>
  );
};

export default Discord; 