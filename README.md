# 🐑 FellowSheep Gaming - Frontend

Website oficial do clan FellowSheep Gaming para Age of Empires 2: Definitive Edition. Uma aplicação web moderna e responsiva desenvolvida em React para gerenciamento completo do clan.

## 📋 Sobre o Projeto

O FellowSheep Gaming é uma Single Page Application (SPA) que oferece uma plataforma completa para membros e visitantes do clan, incluindo sistema de ranking, acompanhamento de partidas, coaching, recursos educacionais e integração com redes sociais.

## ✨ Principais Funcionalidades

### 🏆 Sistema de Rankings
- **Ranking 1v1**: Classificação individual dos membros
- **Ranking Team Games**: Classificação em jogos de equipe
- **Estatísticas Detalhadas**: ELO, taxa de vitória, streaks, jogos totais
- **Histórico de Performance**: Acompanhamento da evolução dos jogadores

### 🎮 Gerenciamento de Partidas
- **Partidas Recentes**: Histórico detalhado das últimas partidas do clan
- **Partidas Ao Vivo**: Acompanhamento em tempo real das partidas ativas
- **Estatísticas por Civilização**: Análise de performance por civilização
- **Mapas Mais Jogados**: Estatísticas de mapas favoritos

### 🎯 Sistema de Matchmaking
- **Lobby Inteligente**: Criação automática de salas balanceadas
- **Filtros Avançados**: Por ELO, tipo de jogo, mapa
- **Sistema de Convites**: Notificações para partidas disponíveis
- **Histórico de Matches**: Acompanhamento de resultados

### 🎓 Recursos Educacionais
- **Coaching Gratuito**: Sistema de mentoria entre membros
- **Build Orders**: Biblioteca completa de estratégias
- **Guias por Civilização**: Estratégias específicas
- **Vídeo Tutoriais**: Conteúdo educacional integrado

### 💬 Integração Social
- **Discord Integration**: Conexão com servidor oficial
- **Sistema de Notificações**: Alertas para eventos importantes
- **Chat em Tempo Real**: Comunicação durante partidas
- **Eventos do Clan**: Calendário de torneios e eventos

### 📺 Centro de Mídia
- **Streams Ao Vivo**: Twitch e YouTube integrados
- **Replays Destacados**: Melhores partidas do clan
- **Galeria de Screenshots**: Momentos memoráveis
- **Canal de Notícias**: Atualizações do jogo e clan

## 🛠️ Tecnologias Utilizadas

### Frontend Core
- **React 18** - Framework principal com hooks modernos
- **React Router DOM 6** - Roteamento SPA
- **Vite** - Build tool rápido e moderno
- **CSS3 Moderno** - Flexbox, Grid, Custom Properties

### Funcionalidades Avançadas
- **React i18next** - Internacionalização (PT, EN, ES, FR, DE, ZH)
- **Axios** - Cliente HTTP para API
- **Concurrently** - Execução simultânea de processos
- **ESLint** - Linting e qualidade de código

### Design e UX
- **Glassmorphism** - Efeitos visuais modernos
- **Responsive Design** - Adaptação completa para mobile
- **Dark/Light Theme** - Temas personalizáveis
- **Smooth Animations** - Transições suaves

## 🎨 Design System

### Paleta de Cores
```css
:root {
  --primary: #2c3e50;      /* Azul escuro principal */
  --secondary: #3498db;    /* Azul claro */
  --accent: #e74c3c;       /* Vermelho de destaque */
  --success: #27ae60;      /* Verde para sucessos */
  --warning: #f39c12;      /* Laranja para avisos */
  --background: #ecf0f1;   /* Fundo claro */
  --surface: #ffffff;      /* Superfícies */
  --text: #2c3e50;         /* Texto principal */
  --text-secondary: #7f8c8d; /* Texto secundário */
}
```

### Componentes UI
- **Cards Glassmorphism** - Efeito de vidro fosco
- **Botões Interativos** - Hover states e feedback visual
- **Modais Responsivos** - Popups adaptativos
- **Loading States** - Indicadores de carregamento
- **Toast Notifications** - Notificações não-intrusivas

## 📱 Estrutura de Navegação

### Menu Principal
```
🏠 Home
├── Dashboard do clan
├── Estatísticas gerais
└── Últimas notícias

🎮 Partidas
├── 🏆 Ranking
│   ├── 1v1 Ranking
│   ├── Team Games
│   └── Empire Wars
├── 🎯 Lobby & Matchmaking
│   ├── Criar Sala
│   ├── Buscar Partida
│   └── Salas Ativas
├── 📊 Partidas Recentes
│   ├── Histórico Detalhado
│   ├── Filtros Avançados
│   └── Estatísticas
└── 🔴 Ao Vivo
    ├── Partidas Ativas
    ├── Espectadores
    └── Comentários

🎓 Aprendizado
├── 👨‍🏫 Coaching
│   ├── Solicitar Mentoria
│   ├── Tornar-se Mentor
│   └── Sessões Agendadas
└── 📜 Build Orders
    ├── Por Civilização
    ├── Por Mapa
    └── Meta Builds

💬 Discord
├── Convite para Servidor
├── Canais Principais
└── Regras do Clan

ℹ️ Informações
├── 💰 Doações
│   ├── Metas Atuais
│   ├── Transparência
│   └── Histórico
└── 📞 Contato
    ├── Formulário
    ├── Equipe
    └── FAQ

🌐 Redes Sociais
├── 🐦 Twitter
├── 📺 YouTube
├── 🎥 Twitch
└── 📸 Instagram
```

## 🚀 Instalação e Execução

### Pré-requisitos
- **Node.js** 18.0.0 ou superior
- **npm** 8.0.0 ou superior
- **Git** para clonagem do repositório

### Instalação Completa
```bash
# Clonar o repositório
git clone <repository-url>
cd fellowsheep

# Instalar dependências do frontend
npm install

# Instalar dependências do backend (opcional)
npm run backend:install
```

### Scripts Disponíveis

```bash
# Desenvolvimento - apenas frontend
npm run dev
# Acesso: http://localhost:5173

# Desenvolvimento - frontend + backend
npm start
# Frontend: http://localhost:5173
# Backend: http://localhost:8000

# Apenas backend
npm run backend
# Acesso: http://localhost:8000

# Build de produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
```

## 📁 Estrutura do Projeto

```
fellowsheep/
├── public/                 # Arquivos estáticos
│   ├── FS-logo.png        # Logo do clan
│   └── logo.png           # Logo alternativo
├── src/                   # Código fonte
│   ├── components/        # Componentes reutilizáveis
│   │   ├── Header.js      # Cabeçalho principal
│   │   ├── Footer.js      # Rodapé
│   │   ├── LanguageSelector.js # Seletor de idioma
│   │   ├── LiveGames.js   # Jogos ao vivo
│   │   ├── LiveStreams.js # Streams ao vivo
│   │   └── BuildOrderModal.js # Modal de build orders
│   ├── pages/             # Páginas da aplicação
│   │   ├── Home.js        # Página inicial
│   │   ├── Ranking.js     # Sistema de ranking
│   │   ├── Lobby.js       # Matchmaking
│   │   ├── RecentMatches.js # Partidas recentes
│   │   ├── LiveMatches.js # Partidas ao vivo
│   │   ├── Coaching.js    # Sistema de coaching
│   │   ├── BuildOrders.js # Build orders
│   │   ├── Discord.js     # Integração Discord
│   │   ├── Donations.js   # Sistema de doações
│   │   └── Contact.js     # Página de contato
│   ├── services/          # Serviços e APIs
│   │   ├── aoeApi.js      # Integração AOE2.net API
│   │   └── liveService.js # Serviços ao vivo
│   ├── data/              # Dados estáticos
│   │   └── fsClanIds.js   # IDs dos membros
│   ├── locales/           # Arquivos de tradução
│   │   ├── en/translation.json # Inglês
│   │   ├── pt/translation.json # Português
│   │   ├── es/translation.json # Espanhol
│   │   ├── fr/translation.json # Francês
│   │   ├── de/translation.json # Alemão
│   │   └── zh/translation.json # Chinês
│   ├── App.js             # Componente principal
│   ├── App.css            # Estilos globais
│   ├── main.jsx           # Ponto de entrada
│   ├── index.css          # Estilos base
│   └── i18n.js            # Configuração i18n
├── dist/                  # Build de produção
├── node_modules/          # Dependências
├── package.json           # Configuração npm
├── vite.config.js         # Configuração Vite
├── vercel.json           # Configuração Vercel
└── README.md             # Esta documentação
```

## 🌐 Configuração de Ambiente

### Variáveis de Ambiente
O projeto detecta automaticamente o ambiente:

```javascript
// Desenvolvimento
const API_URL = 'http://localhost:8000';

// Produção
const API_URL = 'https://fellowsheep-api.vercel.app';
```

### Configuração Personalizada
Crie um arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:8000
VITE_ENABLE_ANALYTICS=true
VITE_DISCORD_INVITE=https://discord.gg/fellowsheep
```

## 🎯 Funcionalidades Detalhadas

### Sistema de Ranking
- **Múltiplos Leaderboards**: 1v1, TG, EW
- **Filtros Avançados**: Por ELO, país, atividade
- **Estatísticas Históricas**: Gráficos de evolução
- **Comparação de Jogadores**: Side-by-side stats

### Matchmaking Inteligente
- **Algoritmo de Balanceamento**: ELO-based matching
- **Preferências de Jogo**: Mapas, civilizações
- **Sistema de Convites**: Notificações push
- **Histórico de Partidas**: Tracking completo

### Centro Educacional
- **Build Orders Interativos**: Step-by-step guides
- **Análise de Replays**: Ferramentas de estudo
- **Coaching Scheduling**: Sistema de agendamento
- **Progress Tracking**: Acompanhamento de evolução

## 📊 Performance e Otimização

### Otimizações Implementadas
- **Code Splitting**: Carregamento sob demanda
- **Image Optimization**: Lazy loading e WebP
- **Bundle Splitting**: Vendor e app separados
- **Tree Shaking**: Eliminação de código morto
- **Caching Strategy**: Service Worker (futuro)

### Métricas de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1

## 🧪 Testes e Qualidade

### Estratégia de Testes
```bash
# Testes unitários (futuro)
npm run test

# Testes e2e (futuro)
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Ferramentas de Qualidade
- **ESLint**: Linting JavaScript/React
- **Prettier**: Formatação de código
- **Husky**: Git hooks (futuro)
- **Lighthouse**: Auditorias de performance

## 🚀 Deploy e CI/CD

### Deploy Automático (Vercel)
O projeto está configurado para deploy automático:

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

### Outras Plataformas
- **Netlify**: Drag & drop do `dist/`
- **GitHub Pages**: Via Actions
- **Firebase Hosting**: `firebase deploy`
- **AWS S3 + CloudFront**: Para escala enterprise

## 🔧 Desenvolvimento Avançado

### Adicionando Novas Páginas
1. Criar componente em `src/pages/`
2. Adicionar rota em `App.js`
3. Atualizar navegação em `Header.js`
4. Adicionar traduções em `locales/`

### Integração com APIs
```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://fellowsheep-api.vercel.app'
    : 'http://localhost:8000',
  timeout: 10000,
});

export default api;
```

### Componentes Reutilizáveis
```javascript
// Exemplo de componente
import React from 'react';
import './PlayerCard.css';

const PlayerCard = ({ player, showStats = true }) => {
  return (
    <div className="player-card">
      <div className="player-info">
        <h3>{player.nickname}</h3>
        <span className="country">{player.country}</span>
      </div>
      {showStats && (
        <div className="player-stats">
          <span className="elo">{player.elo}</span>
          <span className="winrate">{player.winrate}</span>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
```

## 🌍 Internacionalização

### Idiomas Suportados
- 🇧🇷 **Português** (padrão)
- 🇺🇸 **English**
- 🇪🇸 **Español**
- 🇫🇷 **Français**
- 🇩🇪 **Deutsch**
- 🇨🇳 **中文**

### Adicionando Novos Idiomas
1. Criar arquivo em `src/locales/[code]/translation.json`
2. Traduzir todas as chaves existentes
3. Adicionar opção no `LanguageSelector.js`
4. Testar todas as páginas

## 📱 Responsividade

### Breakpoints
```css
/* Mobile First */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 750px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    padding: 2rem;
  }
}

/* Large Desktop */
@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
  }
}
```

### Componentes Mobile-First
- **Hamburger Menu**: Navegação mobile
- **Touch Gestures**: Swipe e tap otimizados
- **Viewport Optimization**: Meta tags configuradas
- **Performance Mobile**: Lazy loading implementado

## 🤝 Contribuindo

### Processo de Contribuição
1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature
4. **Desenvolva** seguindo os padrões
5. **Teste** suas alterações
6. **Commit** com mensagens descritivas
7. **Push** para seu fork
8. **Abra** um Pull Request

### Padrões de Código
```javascript
// Naming conventions
const ComponentName = () => {};  // PascalCase para componentes
const variableName = '';         // camelCase para variáveis
const CONSTANT_NAME = '';        // UPPER_CASE para constantes

// File structure
ComponentName.js                 // Componente principal
ComponentName.css               // Estilos específicos
ComponentName.test.js           // Testes unitários
```

### Commit Messages
```bash
feat: adiciona sistema de notificações
fix: corrige bug no ranking 1v1
docs: atualiza documentação da API
style: melhora responsividade mobile
refactor: otimiza performance do dashboard
test: adiciona testes para componente Player
```

## 🐛 Troubleshooting

### Problemas Comuns

#### Erro de CORS
```javascript
// Configuração do proxy no vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
}
```

#### Build Falha
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Performance Lenta
```javascript
// Lazy loading de componentes
const LazyComponent = React.lazy(() => import('./Component'));

// Uso com Suspense
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] **PWA Support** - Aplicativo offline
- [ ] **Real-time Chat** - WebSocket integration
- [ ] **Tournament System** - Criação de torneios
- [ ] **Achievement System** - Conquistas gamificadas
- [ ] **Mobile App** - React Native version
- [ ] **AI Coaching** - Análise automática de replays

### Melhorias Técnicas
- [ ] **TypeScript Migration** - Tipagem estática
- [ ] **Testing Suite** - Cobertura completa
- [ ] **Performance Monitoring** - Analytics avançados
- [ ] **Error Tracking** - Sentry integration
- [ ] **A/B Testing** - Feature flags
- [ ] **Accessibility** - WCAG compliance

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe de Desenvolvimento

### Core Team
- **🐑 SheepKing** - Líder do Clan & Product Owner
- **⚔️ WoolWarrior** - Vice-Líder & UX Designer
- **💻 FlockCommander** - Lead Developer & DevOps
- **🎯 RamMaster** - Community Manager & QA

### Contribuidores
Agradecemos a todos os membros da comunidade que contribuíram para este projeto!

## 📞 Suporte e Contato

### Canais de Comunicação
- **🎮 Discord**: [discord.gg/fellowsheep](https://discord.gg/fellowsheep)
- **📧 Email**: dev@fellowsheep.com
- **🐙 GitHub**: [Issues](https://github.com/fellowsheep/frontend/issues)
- **🌐 Website**: [fellowsheep-gaming.com](https://fellowsheep-gaming.com)

### Horários de Suporte
- **Segunda a Sexta**: 19h - 23h (BRT)
- **Fins de Semana**: 14h - 18h (BRT)
- **Emergências**: Discord @FlockCommander

---

**Desenvolvido com ❤️ e muito café pela comunidade FellowSheep Gaming**

*"Juntos somos mais fortes que qualquer exército de cavaleiros!"* 🐑⚔️