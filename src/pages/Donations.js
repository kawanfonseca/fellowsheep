import React, { useState } from 'react';

const Donations = () => {
  const [donationGoals] = useState([
    {
      id: 1,
      title: 'Servidor Discord Premium',
      description: 'Upgrade para melhor qualidade de voz e recursos extras',
      current: 35,
      target: 50,
      monthly: true,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Prêmios para Torneios',
      description: 'Prêmios para nossos torneios internos mensais',
      current: 120,
      target: 200,
      monthly: false,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Hospedagem do Site',
      description: 'Manter nosso site online com domínio personalizado',
      current: 15,
      target: 25,
      monthly: true,
      priority: 'high'
    },
    {
      id: 4,
      title: 'Equipamentos para Streaming',
      description: 'Melhorar a qualidade das nossas transmissões',
      current: 300,
      target: 800,
      monthly: false,
      priority: 'low'
    }
  ]);

  const [recentDonations] = useState([
    { name: 'SheepKing', amount: 25, date: '2025-01-05', message: 'Para o crescimento do clan!' },
    { name: 'Anônimo', amount: 10, date: '2025-01-04', message: 'Obrigado pelo coaching gratuito' },
    { name: 'WoolWarrior', amount: 15, date: '2025-01-03', message: 'Vamos dominar o AoE2!' },
    { name: 'FlockCommander', amount: 20, date: '2025-01-02', message: 'Apoio total ao projeto' }
  ]);

  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const predefinedAmounts = [5, 10, 15, 25, 50, 100];

  const getPriorityColor = (priority) => {
    if (priority === 'high') return '#ff6b6b';
    if (priority === 'medium') return '#ffd93d';
    return '#6bcf7f';
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const totalRaised = donationGoals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = donationGoals.reduce((sum, goal) => sum + goal.target, 0);

  return (
    <div className="page-container">
      <h1 className="page-title">💰 Doações & Apoio</h1>
      <p className="page-subtitle">
        Ajude-nos a manter e melhorar nossa comunidade
      </p>
      
      <div className="card">
        <h3>📊 Resumo das Doações</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#d4af37', fontWeight: 'bold'}}>R$ {totalRaised}</div>
            <div style={{color: '#e0e0e0'}}>Arrecadado</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#6bcf7f', fontWeight: 'bold'}}>R$ {totalTarget}</div>
            <div style={{color: '#e0e0e0'}}>Meta Total</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#74c0fc', fontWeight: 'bold'}}>
              {Math.round((totalRaised / totalTarget) * 100)}%
            </div>
            <div style={{color: '#e0e0e0'}}>Progresso</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#ffd93d', fontWeight: 'bold'}}>
              {recentDonations.length}
            </div>
            <div style={{color: '#e0e0e0'}}>Doadores</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3>🎯 Metas de Doação</h3>
        <div style={{display: 'grid', gap: '1rem'}}>
          {donationGoals.map((goal) => (
            <div key={goal.id} className="card" style={{background: '#3a3a3a'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem'}}>
                    <h4 style={{color: '#d4af37', margin: 0}}>{goal.title}</h4>
                    <span style={{
                      color: getPriorityColor(goal.priority),
                      background: 'rgba(0,0,0,0.3)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase'
                    }}>
                      {goal.priority === 'high' ? 'Urgente' : goal.priority === 'medium' ? 'Médio' : 'Baixo'}
                    </span>
                    {goal.monthly && (
                      <span style={{
                        color: '#74c0fc',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        Mensal
                      </span>
                    )}
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '1rem'}}>
                    {goal.description}
                  </div>
                  <div style={{marginBottom: '0.5rem'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                      <span style={{color: '#e0e0e0'}}>
                        R$ {goal.current} / R$ {goal.target}
                      </span>
                      <span style={{color: '#d4af37', fontWeight: 'bold'}}>
                        {Math.round(getProgressPercentage(goal.current, goal.target))}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '10px',
                      background: '#2d2d2d',
                      borderRadius: '5px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${getProgressPercentage(goal.current, goal.target)}%`,
                        height: '100%',
                        background: getPriorityColor(goal.priority),
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h3>💳 Fazer uma Doação</h3>
        <p style={{color: '#e0e0e0', marginBottom: '1rem'}}>
          Toda doação é muito bem-vinda e nos ajuda a manter nossa comunidade ativa e crescendo!
        </p>
        
        <div style={{marginBottom: '1rem'}}>
          <h4 style={{color: '#d4af37', marginBottom: '0.5rem'}}>Escolha o valor:</h4>
          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem'}}>
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: selectedAmount === amount ? '#d4af37' : 'transparent',
                  color: selectedAmount === amount ? '#1a1a1a' : '#d4af37',
                  border: '2px solid #d4af37',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                R$ {amount}
              </button>
            ))}
          </div>
          
          <div style={{marginBottom: '1rem'}}>
            <label style={{color: '#d4af37', display: 'block', marginBottom: '0.5rem'}}>
              Ou digite um valor personalizado:
            </label>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount('');
              }}
              placeholder="Ex: 30"
              style={{
                width: '100%',
                padding: '0.5rem',
                background: '#2d2d2d',
                border: '1px solid #d4af37',
                borderRadius: '4px',
                color: '#e0e0e0'
              }}
            />
          </div>
        </div>
        
        <div style={{marginBottom: '1rem'}}>
          <label style={{color: '#d4af37', display: 'block', marginBottom: '0.5rem'}}>
            Mensagem (opcional):
          </label>
          <textarea
            value={donationMessage}
            onChange={(e) => setDonationMessage(e.target.value)}
            placeholder="Deixe uma mensagem de apoio..."
            style={{
              width: '100%',
              padding: '0.5rem',
              background: '#2d2d2d',
              border: '1px solid #d4af37',
              borderRadius: '4px',
              color: '#e0e0e0',
              minHeight: '80px'
            }}
          />
        </div>
        
        <div style={{marginBottom: '1rem'}}>
          <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e0e0e0'}}>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              style={{transform: 'scale(1.2)'}}
            />
            Doação anônima
          </label>
        </div>
        
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
          <button className="btn" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <span>💳</span> PIX
          </button>
          <button className="btn" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <span>💰</span> PayPal
          </button>
          <button className="btn" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <span>🏦</span> Transferência
          </button>
        </div>
      </div>
      
      <div className="card">
        <h3>🙏 Doações Recentes</h3>
        <div style={{display: 'grid', gap: '0.5rem'}}>
          {recentDonations.map((donation, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: '#3a3a3a',
              borderRadius: '4px',
              border: '1px solid #444'
            }}>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem'}}>
                  <span style={{color: '#d4af37', fontWeight: 'bold'}}>
                    {donation.name}
                  </span>
                  <span style={{color: '#6bcf7f', fontWeight: 'bold'}}>
                    R$ {donation.amount}
                  </span>
                  <span style={{color: '#888', fontSize: '0.9rem'}}>
                    {new Date(donation.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {donation.message && (
                  <div style={{color: '#e0e0e0', fontSize: '0.9rem', fontStyle: 'italic'}}>
                    "{donation.message}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h3>❓ Transparência</h3>
        <p style={{color: '#e0e0e0'}}>
          💡 <strong>Para que são usadas as doações:</strong><br/>
          • Hospedagem do site e domínio<br/>
          • Upgrades do servidor Discord<br/>
          • Prêmios para torneios internos<br/>
          • Equipamentos para streaming<br/>
          • Ferramentas para melhorar a experiência da comunidade<br/><br/>
          
          📊 <strong>Transparência total:</strong> Publicamos relatórios mensais de gastos no Discord<br/>
          🎯 <strong>Sem fins lucrativos:</strong> 100% das doações são investidas na comunidade<br/>
          🤝 <strong>Voluntário:</strong> Toda administração é feita por amor ao jogo e à comunidade
        </p>
      </div>
    </div>
  );
};

export default Donations; 