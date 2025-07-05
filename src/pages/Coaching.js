import React, { useState } from 'react';

const Coaching = () => {
  const [coaches] = useState([
    {
      id: 1,
      name: 'SheepKing',
      elo: 1847,
      specialties: ['Estratégia', 'Micro', 'Late Game'],
      experience: '5 anos',
      languages: ['Português', 'Inglês'],
      price: 'Gratuito',
      rating: 4.9,
      students: 23,
      available: true
    },
    {
      id: 2,
      name: 'WoolWarrior',
      elo: 1756,
      specialties: ['Fast Castle', 'Eco Management', 'Team Games'],
      experience: '3 anos',
      languages: ['Português'],
      price: 'Gratuito',
      rating: 4.8,
      students: 18,
      available: true
    },
    {
      id: 3,
      name: 'FlockCommander',
      elo: 1689,
      specialties: ['Build Orders', 'Timing Attacks', 'Civs'],
      experience: '4 anos',
      languages: ['Português', 'Espanhol'],
      price: 'Gratuito',
      rating: 4.7,
      students: 15,
      available: false
    }
  ]);

  const [trainingPrograms] = useState([
    {
      id: 1,
      name: 'Fundamentos para Iniciantes',
      duration: '4 semanas',
      level: 'Iniciante',
      topics: ['Conceitos básicos', 'Primeiros build orders', 'Micro básico'],
      instructor: 'FlockCommander',
      nextStart: '2025-01-15',
      spots: 8
    },
    {
      id: 2,
      name: 'Estratégias Avançadas',
      duration: '6 semanas',
      level: 'Avançado',
      topics: ['Meta strategies', 'Timing attacks', 'Adaptação'],
      instructor: 'SheepKing',
      nextStart: '2025-01-20',
      spots: 5
    },
    {
      id: 3,
      name: 'Dominando Team Games',
      duration: '3 semanas',
      level: 'Intermediário',
      topics: ['Coordenação', 'Especializações', 'Comunicação'],
      instructor: 'WoolWarrior',
      nextStart: '2025-01-25',
      spots: 12
    }
  ]);

  const [selectedCoach, setSelectedCoach] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    message: '',
    preferredTime: '',
    topics: ''
  });

  const getLevelColor = (level) => {
    if (level === 'Iniciante') return '#6bcf7f';
    if (level === 'Intermediário') return '#ffd93d';
    return '#ff6b6b';
  };

  const handleBooking = (coach) => {
    setSelectedCoach(coach);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🎓 Coaching & Treinamento</h1>
      <p className="page-subtitle">
        Aprenda com os melhores jogadores do nosso clan
      </p>
      
      <div className="card">
        <h3>📊 Nosso Sistema de Coaching</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#d4af37', fontWeight: 'bold'}}>3</div>
            <div style={{color: '#e0e0e0'}}>Coaches Ativos</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#6bcf7f', fontWeight: 'bold'}}>56</div>
            <div style={{color: '#e0e0e0'}}>Alunos Treinados</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#74c0fc', fontWeight: 'bold'}}>4.8</div>
            <div style={{color: '#e0e0e0'}}>Avaliação Média</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#ffd93d', fontWeight: 'bold'}}>100%</div>
            <div style={{color: '#e0e0e0'}}>Gratuito</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3>👨‍🏫 Nossos Coaches</h3>
        <div style={{display: 'grid', gap: '1rem'}}>
          {coaches.map((coach) => (
            <div key={coach.id} className="card" style={{background: '#3a3a3a'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem'}}>
                    <h4 style={{color: '#d4af37', margin: 0}}>{coach.name}</h4>
                    <span style={{color: '#e0e0e0', fontWeight: 'bold'}}>
                      {coach.elo} ELO
                    </span>
                    <span style={{
                      color: coach.available ? '#6bcf7f' : '#ff6b6b',
                      fontWeight: 'bold'
                    }}>
                      {coach.available ? '🟢 Disponível' : '🔴 Ocupado'}
                    </span>
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>Especialidades:</strong> {coach.specialties.join(', ')}
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>Experiência:</strong> {coach.experience} | <strong>Idiomas:</strong> {coach.languages.join(', ')}
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    ⭐ {coach.rating} ({coach.students} alunos) | <strong>Preço:</strong> {coach.price}
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  <button 
                    className="btn" 
                    style={{fontSize: '0.9rem'}}
                    onClick={() => handleBooking(coach)}
                    disabled={!coach.available}
                  >
                    {coach.available ? 'Agendar' : 'Indisponível'}
                  </button>
                  <button className="btn-secondary btn" style={{fontSize: '0.9rem'}}>
                    Perfil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h3>🎯 Programas de Treinamento</h3>
        <div style={{display: 'grid', gap: '1rem'}}>
          {trainingPrograms.map((program) => (
            <div key={program.id} className="card" style={{background: '#3a3a3a'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem'}}>
                    <h4 style={{color: '#d4af37', margin: 0}}>{program.name}</h4>
                    <span style={{
                      color: getLevelColor(program.level),
                      fontWeight: 'bold',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px'
                    }}>
                      {program.level}
                    </span>
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>Duração:</strong> {program.duration} | <strong>Instrutor:</strong> {program.instructor}
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>Tópicos:</strong> {program.topics.join(', ')}
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>Próxima turma:</strong> {program.nextStart} | <strong>Vagas:</strong> {program.spots}
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  <button className="btn" style={{fontSize: '0.9rem'}}>
                    Inscrever-se
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
      
      {selectedCoach && (
        <div className="card" style={{border: '2px solid #d4af37'}}>
          <h3>📅 Agendar Sessão com {selectedCoach.name}</h3>
          <div style={{display: 'grid', gap: '1rem'}}>
            <div>
              <label style={{color: '#d4af37', display: 'block', marginBottom: '0.5rem'}}>
                Mensagem (opcional):
              </label>
              <textarea
                value={bookingForm.message}
                onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                placeholder="Descreva seus objetivos e dúvidas..."
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: '#2d2d2d',
                  border: '1px solid #d4af37',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  minHeight: '100px'
                }}
              />
            </div>
            <div>
              <label style={{color: '#d4af37', display: 'block', marginBottom: '0.5rem'}}>
                Horário preferido:
              </label>
              <input
                type="text"
                value={bookingForm.preferredTime}
                onChange={(e) => setBookingForm({...bookingForm, preferredTime: e.target.value})}
                placeholder="Ex: Terça-feira às 19h"
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
            <div style={{display: 'flex', gap: '1rem'}}>
              <button className="btn">Enviar Solicitação</button>
              <button 
                className="btn-secondary btn"
                onClick={() => setSelectedCoach(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="card">
        <h3>💡 Dicas de Coaching</h3>
        <p>
          🎯 <strong>Defina objetivos claros:</strong> Saiba o que quer melhorar antes da sessão<br/>
          📝 <strong>Faça anotações:</strong> Anote as dicas e estratégias aprendidas<br/>
          🎮 <strong>Pratique:</strong> Aplique o que aprendeu em partidas reais<br/>
          🤝 <strong>Seja receptivo:</strong> Esteja aberto a feedback e sugestões<br/>
          ⏰ <strong>Seja pontual:</strong> Respeite o tempo do seu coach e dos outros alunos
        </p>
      </div>
    </div>
  );
};

export default Coaching; 