import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const BuildOrders = () => {
  const { t } = useTranslation();
  const [buildOrders] = useState([
    {
      id: 1,
      name: 'Fast Castle',
      civilization: 'Todas',
      category: 'Economia',
      difficulty: 'Intermediário',
      author: 'SheepKing',
      rating: 4.8,
      views: 1234,
      description: 'Build order clássico para desenvolvimento econômico rápido',
      timeToAge: '16:30',
      steps: [
        '6 vils na madeira',
        '4 vils na comida (ovelhas)',
        '1 vil construir house',
        '2 vils na comida',
        '1 vil na madeira',
        'Subir Feudal (22 pop)',
        '2 vils na pedra',
        '1 vil na madeira',
        'Subir Castle (27 pop)'
      ]
    },
    {
      id: 2,
      name: 'Archer Rush',
      civilization: 'Britons',
      category: 'Militar',
      difficulty: 'Iniciante',
      author: 'WoolWarrior',
      rating: 4.6,
      views: 987,
      description: 'Rush agressivo com archery range early',
      timeToAge: '10:30',
      steps: [
        '6 vils na madeira',
        '4 vils na comida',
        '1 vil construir house',
        '3 vils na comida',
        '1 vil na madeira',
        'Subir Feudal (22 pop)',
        'Construir archery range',
        'Treinar archers'
      ]
    },
    {
      id: 3,
      name: 'Scout Rush',
      civilization: 'Mongols',
      category: 'Militar',
      difficulty: 'Iniciante',
      author: 'FlockCommander',
      rating: 4.7,
      views: 856,
      description: 'Rush com cavalaria leve para pressão early',
      timeToAge: '10:05',
      steps: [
        '6 vils na madeira',
        '4 vils na comida',
        '1 vil construir house',
        '3 vils na comida',
        '1 vil na madeira',
        'Subir Feudal (22 pop)',
        'Construir stable',
        'Treinar scouts'
      ]
    },
    {
      id: 4,
      name: 'Tower Rush',
      civilization: 'Incas',
      category: 'Estratégico',
      difficulty: 'Avançado',
      author: 'RamMaster',
      rating: 4.5,
      views: 654,
      description: 'Estratégia de towers ofensivas',
      timeToAge: '8:45',
      steps: [
        '6 vils na madeira',
        '3 vils na comida',
        '1 vil construir house',
        '3 vils na pedra',
        '1 vil na madeira',
        'Subir Feudal (22 pop)',
        'Construir towers no inimigo'
      ]
    },
    {
      id: 5,
      name: 'Boom Economy',
      civilization: 'Mayans',
      category: 'Economia',
      difficulty: 'Intermediário',
      author: 'CastleBuilder',
      rating: 4.9,
      views: 2143,
      description: 'Foco total em economia para late game',
      timeToAge: '17:45',
      steps: [
        '6 vils na madeira',
        '4 vils na comida',
        '2 vils construir houses',
        '8 vils na comida',
        '3 vils na madeira',
        'Subir Feudal (24 pop)',
        'Mais TCs'
      ]
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCivilization, setSelectedCivilization] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedBuildOrder, setSelectedBuildOrder] = useState(null);

  const categories = ['all', 'Economia', 'Militar', 'Estratégico'];
  const civilizations = ['all', 'Todas', 'Britons', 'Mongols', 'Incas', 'Mayans'];
  const difficulties = ['all', 'Iniciante', 'Intermediário', 'Avançado'];

  const filteredBuildOrders = buildOrders.filter(bo => {
    const categoryMatch = selectedCategory === 'all' || bo.category === selectedCategory;
    const civMatch = selectedCivilization === 'all' || bo.civilization === selectedCivilization;
    const difficultyMatch = selectedDifficulty === 'all' || bo.difficulty === selectedDifficulty;
    return categoryMatch && civMatch && difficultyMatch;
  });

  const getCategoryColor = (category) => {
    if (category === 'Economia') return '#6bcf7f';
    if (category === 'Militar') return '#ff6b6b';
    return '#ffd93d';
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Iniciante') return '#6bcf7f';
    if (difficulty === 'Intermediário') return '#ffd93d';
    return '#ff6b6b';
  };

  return (
    <div className="page-container">
      <h1 className="page-title">{t('build_orders.title')}</h1>
      <p className="page-subtitle">
        {t('build_orders.subtitle')}
      </p>
      
      <div className="card">
        <h3>📊 Estatísticas da Biblioteca</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#d4af37', fontWeight: 'bold'}}>{buildOrders.length}</div>
            <div style={{color: '#e0e0e0'}}>Build Orders</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#6bcf7f', fontWeight: 'bold'}}>
              {buildOrders.reduce((sum, bo) => sum + bo.views, 0)}
            </div>
            <div style={{color: '#e0e0e0'}}>Visualizações</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#74c0fc', fontWeight: 'bold'}}>
              {(buildOrders.reduce((sum, bo) => sum + bo.rating, 0) / buildOrders.length).toFixed(1)}
            </div>
            <div style={{color: '#e0e0e0'}}>Avaliação Média</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', color: '#ffd93d', fontWeight: 'bold'}}>5</div>
            <div style={{color: '#e0e0e0'}}>Contribuidores</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3>🔍 Filtros</h3>
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.5rem',
              background: '#2d2d2d',
              border: '1px solid #d4af37',
              borderRadius: '4px',
              color: '#e0e0e0'
            }}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas as Categorias' : category}
              </option>
            ))}
          </select>
          
          <select 
            value={selectedCivilization}
            onChange={(e) => setSelectedCivilization(e.target.value)}
            style={{
              padding: '0.5rem',
              background: '#2d2d2d',
              border: '1px solid #d4af37',
              borderRadius: '4px',
              color: '#e0e0e0'
            }}
          >
            {civilizations.map(civ => (
              <option key={civ} value={civ}>
                {civ === 'all' ? 'Todas as Civilizações' : civ}
              </option>
            ))}
          </select>
          
          <select 
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{
              padding: '0.5rem',
              background: '#2d2d2d',
              border: '1px solid #d4af37',
              borderRadius: '4px',
              color: '#e0e0e0'
            }}
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff === 'all' ? 'Todas as Dificuldades' : diff}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="card">
        <h3>📚 Build Orders ({filteredBuildOrders.length})</h3>
        <div style={{display: 'grid', gap: '1rem'}}>
          {filteredBuildOrders.map((bo) => (
            <div key={bo.id} className="card" style={{background: '#3a3a3a'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem'}}>
                    <h4 style={{color: '#d4af37', margin: 0}}>{bo.name}</h4>
                    <span style={{
                      color: getCategoryColor(bo.category),
                      background: 'rgba(0,0,0,0.3)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}>
                      {bo.category}
                    </span>
                    <span style={{
                      color: getDifficultyColor(bo.difficulty),
                      background: 'rgba(0,0,0,0.3)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}>
                      {bo.difficulty}
                    </span>
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    <strong>Civilização:</strong> {bo.civilization} | <strong>Autor:</strong> {bo.author}
                  </div>
                  <div style={{color: '#e0e0e0', marginBottom: '0.5rem'}}>
                    {bo.description}
                  </div>
                  <div style={{color: '#888', fontSize: '0.9rem'}}>
                    ⭐ {bo.rating} | 👁️ {bo.views} visualizações | ⏱️ {bo.timeToAge}
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  <button 
                    className="btn" 
                    style={{fontSize: '0.9rem'}}
                    onClick={() => setSelectedBuildOrder(bo)}
                  >
                    Ver Detalhes
                  </button>
                  <button className="btn-secondary btn" style={{fontSize: '0.9rem'}}>
                    Favoritar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedBuildOrder && (
        <div className="card" style={{border: '2px solid #d4af37'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h3>{selectedBuildOrder.name} - Passos Detalhados</h3>
            <button 
              className="btn-secondary btn"
              onClick={() => setSelectedBuildOrder(null)}
            >
              Fechar
            </button>
          </div>
          
          <div style={{marginBottom: '1rem'}}>
            <strong>Civilização:</strong> {selectedBuildOrder.civilization} | 
            <strong> Categoria:</strong> {selectedBuildOrder.category} | 
            <strong> Dificuldade:</strong> {selectedBuildOrder.difficulty}
          </div>
          
          <div style={{marginBottom: '1rem'}}>
            <strong>Descrição:</strong> {selectedBuildOrder.description}
          </div>
          
          <div>
            <strong>Passos:</strong>
            <ol style={{color: '#e0e0e0', marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
              {selectedBuildOrder.steps.map((step, index) => (
                <li key={index} style={{marginBottom: '0.25rem'}}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          
          <div style={{marginTop: '1rem'}}>
            <button className="btn" style={{marginRight: '1rem'}}>
              Copiar para Clipboard
            </button>
            <button className="btn-secondary btn">
              Imprimir
            </button>
          </div>
        </div>
      )}
      
      <div className="card">
        <h3>💡 Como Usar Build Orders</h3>
        <p>
          📝 <strong>Pratique no Editor de Cenários:</strong> Teste sem pressão antes de usar online<br/>
          ⏱️ <strong>Foque no Timing:</strong> Tempos são cruciais para o sucesso<br/>
          🎯 <strong>Adapte-se:</strong> Ajuste conforme a situação da partida<br/>
          🔄 <strong>Repita:</strong> Pratique até ficar automático<br/>
          📊 <strong>Meça Performance:</strong> Compare seus tempos com os ideais
        </p>
      </div>
    </div>
  );
};

export default BuildOrders; 