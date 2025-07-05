import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const [submitStatus, setSubmitStatus] = useState('');

  const contactTypes = [
    { value: 'general', label: 'Dúvida Geral' },
    { value: 'join', label: 'Quero Entrar no Clan' },
    { value: 'coaching', label: 'Coaching' },
    { value: 'partnership', label: 'Parceria' },
    { value: 'bug', label: 'Reportar Bug' },
    { value: 'suggestion', label: 'Sugestão' }
  ];

  const teamMembers = [
    {
      name: 'SheepKing',
      role: 'Líder do Clan',
      contact: '@SheepKing#1234',
      specialties: ['Administração', 'Estratégia', 'Torneios'],
      available: true
    },
    {
      name: 'WoolWarrior',
      role: 'Vice-Líder',
      contact: '@WoolWarrior#5678',
      specialties: ['Coaching', 'Recrutamento', 'Eventos'],
      available: true
    },
    {
      name: 'FlockCommander',
      role: 'Moderador',
      contact: '@FlockCommander#9012',
      specialties: ['Suporte Técnico', 'Discord', 'Website'],
      available: false
    },
    {
      name: 'RamMaster',
      role: 'Organizador de Eventos',
      contact: '@RamMaster#3456',
      specialties: ['Torneios', 'Transmissões', 'Mídias Sociais'],
      available: true
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação de envio
    setSubmitStatus('sending');
    setTimeout(() => {
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
      setTimeout(() => setSubmitStatus(''), 3000);
    }, 2000);
  };

  const getStatusColor = (available) => {
    return available ? '#6bcf7f' : '#ff6b6b';
  };

  return (
    <div className="page-container">
      <h1 className="page-title">📞 Contato</h1>
      <p className="page-subtitle">
        Entre em contato conosco - estamos aqui para ajudar!
      </p>
      
      <div className="card">
        <h3>📧 Formulário de Contato</h3>
        <form onSubmit={handleSubmit} style={{display: 'grid', gap: '1rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem'}}>
            <div>
              <label style={{color: '#d4af37', display: 'block', marginBottom: '0.5rem'}}>
                Nome *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#2d2d2d',
                  border: '1px solid #d4af37',
                  borderRadius: '4px',
                  color: '#e0e0e0'
                }}
              />
            </div>
            <div>
              <label style={{color: '#d4af37', display: 'block', marginBottom: '0.5rem'}}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#2d2d2d',
                  border: '1px solid #d4af37',
                  borderRadius: '4px',
                  color: '#e0e0e0'
                }}
              />
            </div>
          </div>
          
          <div>
            <label style={{color: '#d4af37', display: 'block', marginBottom: '0.5rem'}}>
              Tipo de Contato *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#2d2d2d',
                border: '1px solid #d4af37',
                borderRadius: '4px',
                color: '#e0e0e0'
              }}
            >
              {contactTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{color: '#d4af37', display: 'block', marginBottom: '0.5rem'}}>
              Assunto *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#2d2d2d',
                border: '1px solid #d4af37',
                borderRadius: '4px',
                color: '#e0e0e0'
              }}
            />
          </div>
          
          <div>
            <label style={{color: '#d4af37', display: 'block', marginBottom: '0.5rem'}}>
              Mensagem *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              placeholder="Descreva sua dúvida ou mensagem..."
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#2d2d2d',
                border: '1px solid #d4af37',
                borderRadius: '4px',
                color: '#e0e0e0',
                minHeight: '120px',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div>
            <button 
              type="submit" 
              className="btn"
              disabled={submitStatus === 'sending'}
              style={{
                opacity: submitStatus === 'sending' ? 0.7 : 1,
                cursor: submitStatus === 'sending' ? 'not-allowed' : 'pointer'
              }}
            >
              {submitStatus === 'sending' ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
            
            {submitStatus === 'success' && (
              <div style={{
                color: '#6bcf7f',
                marginTop: '0.5rem',
                fontWeight: 'bold'
              }}>
                ✅ Mensagem enviada com sucesso! Responderemos em breve.
              </div>
            )}
          </div>
        </form>
      </div>
      
      <div className="card">
        <h3>👥 Nossa Equipe</h3>
        <div style={{display: 'grid', gap: '1rem'}}>
          {teamMembers.map((member, index) => (
            <div key={index} className="card" style={{background: '#3a3a3a'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem'}}>
                    <h4 style={{color: '#d4af37', margin: 0}}>{member.name}</h4>
                    <span style={{color: '#e0e0e0', fontSize: '0.9rem'}}>
                      {member.role}
                    </span>
                    <span style={{
                      color: getStatusColor(member.available),
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      {member.available ? '🟢 Disponível' : '🔴 Ocupado'}
                    </span>
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>Discord:</strong> {member.contact}
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>Especialidades:</strong> {member.specialties.join(', ')}
                  </div>
                </div>
                <div>
                  <button 
                    className="btn" 
                    style={{fontSize: '0.9rem'}}
                    disabled={!member.available}
                  >
                    {member.available ? 'Contatar' : 'Indisponível'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h3>📱 Outros Canais de Comunicação</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem'}}>
          <div className="card" style={{background: '#3a3a3a', textAlign: 'center'}}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>💬</div>
            <h4 style={{color: '#d4af37', marginBottom: '0.5rem'}}>Discord</h4>
            <p style={{color: '#e0e0e0', marginBottom: '1rem'}}>
              Nosso canal principal de comunicação
            </p>
            <button className="btn" style={{fontSize: '0.9rem'}}>
              Entrar no Discord
            </button>
          </div>
          
          <div className="card" style={{background: '#3a3a3a', textAlign: 'center'}}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📧</div>
            <h4 style={{color: '#d4af37', marginBottom: '0.5rem'}}>Email</h4>
            <p style={{color: '#e0e0e0', marginBottom: '1rem'}}>
              contato@fellowsheep.com
            </p>
            <button className="btn" style={{fontSize: '0.9rem'}}>
              Enviar Email
            </button>
          </div>
          
          <div className="card" style={{background: '#3a3a3a', textAlign: 'center'}}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎮</div>
            <h4 style={{color: '#d4af37', marginBottom: '0.5rem'}}>Steam</h4>
            <p style={{color: '#e0e0e0', marginBottom: '1rem'}}>
              Grupo oficial no Steam
            </p>
            <button className="btn" style={{fontSize: '0.9rem'}}>
              Ver Grupo
            </button>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3>⏰ Horários de Atendimento</h3>
        <div style={{color: '#e0e0e0'}}>
          <p style={{marginBottom: '0.5rem'}}>
            <strong>Segunda a Sexta:</strong> 19h às 23h (horário de Brasília)
          </p>
          <p style={{marginBottom: '0.5rem'}}>
            <strong>Sábado:</strong> 14h às 00h (horário de Brasília)
          </p>
          <p style={{marginBottom: '0.5rem'}}>
            <strong>Domingo:</strong> 18h às 22h (horário de Brasília)
          </p>
          <p style={{marginBottom: '1rem'}}>
            <strong>Feriados:</strong> Horário reduzido ou indisponível
          </p>
          
          <div style={{background: '#3a3a3a', padding: '1rem', borderRadius: '4px'}}>
            <p style={{color: '#d4af37', fontWeight: 'bold', marginBottom: '0.5rem'}}>
              📍 Tempo de Resposta Médio:
            </p>
            <p>
              • Discord: Imediato (durante horário de atendimento)<br/>
              • Email: 24-48 horas<br/>
              • Formulário: 12-24 horas
            </p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3>❓ Perguntas Frequentes</h3>
        <div style={{color: '#e0e0e0'}}>
          <p style={{marginBottom: '0.5rem'}}>
            <strong>Como entrar no clan?</strong><br/>
            Entre no nosso Discord e procure por um moderador ou líder.
          </p>
          <p style={{marginBottom: '0.5rem'}}>
            <strong>Há requisitos de ELO?</strong><br/>
            Não! Aceitamos jogadores de todos os níveis.
          </p>
          <p style={{marginBottom: '0.5rem'}}>
            <strong>O coaching é gratuito?</strong><br/>
            Sim, todos os nossos serviços de coaching são gratuitos.
          </p>
          <p style={{marginBottom: '0.5rem'}}>
            <strong>Posso contribuir com o site?</strong><br/>
            Claro! Somos opensource e adoramos contribuições.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact; 