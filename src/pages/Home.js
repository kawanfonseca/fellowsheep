import React from 'react';

const Home = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">Bem-vindos ao Fellowsheep Gaming</h1>
      <p className="page-subtitle">
        O mais épico clan de Age of Empires 2 Definitive Edition
      </p>
      
      <div className="card">
        <h3>🏰 Sobre Nós</h3>
        <p>
          Somos um grupo de jogadores apaixonados por Age of Empires 2 DE, focados em 
          crescer juntos, compartilhar conhecimento e dominar os campos de batalha medievais. 
          Nosso clan é dedicado tanto a jogadores iniciantes quanto veteranos.
        </p>
      </div>
      
      <div className="card">
        <h3>⚔️ Nossos Pilares</h3>
        <p>
          <strong>Competição:</strong> Participamos de torneios e ranqueamos juntos<br/>
          <strong>Aprendizado:</strong> Compartilhamos estratégias e build orders<br/>
          <strong>Comunidade:</strong> Criamos amizades que vão além do jogo<br/>
          <strong>Diversão:</strong> Porque jogar deve ser sempre divertido!
        </p>
      </div>
      
      <div className="card">
        <h3>🎯 Destaques Recentes</h3>
        <p>
          • Subimos 3 posições no ranking mundial de clans<br/>
          • 15 membros alcançaram novo ELO pessoal este mês<br/>
          • Organizamos nosso primeiro torneio interno com 32 participantes<br/>
          • Novo sistema de coaching implementado com sucesso
        </p>
      </div>
      
      <div className="card">
        <h3>🚀 Junte-se a Nós</h3>
        <p>
          Está procurando um clan ativo e acolhedor? Temos espaço para jogadores de todos os níveis! 
          Entre em contato conosco através do Discord ou da seção de contato.
        </p>
        <button className="btn" style={{marginTop: '1rem'}}>
          Quero Fazer Parte!
        </button>
      </div>
    </div>
  );
};

export default Home; 