# 🐑 FellowSheep Gaming

Site oficial do clan FellowSheep Gaming para Age of Empires 2 DE.

## 🏗️ Arquitetura

O projeto está dividido em duas partes:

- **Frontend**: React + Vite (pasta raiz)
- **Backend**: FastAPI Python (pasta `backend/`)

## 🎮 Sobre o Projeto

Este é um website SPA (Single Page Application) desenvolvido em React para o clan Fellowsheep Gaming. O site oferece uma plataforma completa para gerenciamento do clan, incluindo ranking, matchmaking, coaching, e muito mais.

## 🎨 Design

- **Paleta de Cores**: Cinza e branco para um visual moderno e clean
- **Estilo**: Design moderno com elementos glassmorphism e animações suaves
- **Responsivo**: Totalmente adaptado para desktop, tablet e mobile

## 🚀 Funcionalidades

### 📊 Ranking
- Classificação dos membros do clan
- Estatísticas detalhadas (ELO, taxa de vitória, jogos)
- Conquistas e destaques

### 🎯 Lobby & Matchmaking
- Sistema de matchmaking rápido
- Criação e gerenciamento de salas
- Filtros por tipo de jogo

### 📈 Partidas
- **Recentes**: Histórico detalhado das últimas partidas
- **Ao Vivo**: Acompanhamento em tempo real das partidas ativas

### 🎓 Aprendizado
- **Coaching**: Sistema de mentoria gratuita
- **Build Orders**: Biblioteca de estratégias e builds

### 💬 Discord
- Integração com servidor Discord
- Estrutura de canais e cargos
- Convites e estatísticas

### 💰 Doações
- Sistema transparente de doações
- Metas e progresso
- Relatórios de uso dos recursos

### 📞 Contato
- Formulário de contato
- Informações da equipe
- Canais de comunicação

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **React Router DOM** - Navegação SPA
- **CSS3** - Estilização moderna
- **JavaScript ES6+** - Lógica da aplicação

## 📱 Responsividade

O site é totalmente responsivo com:
- Menu mobile com hamburger
- Dropdowns adaptados para touch
- Layout flexível para diferentes tamanhos de tela
- Otimizado para performance em dispositivos móveis

## 🎯 Estrutura de Navegação

### Menu Principal
- **🏠 Home** - Página inicial
- **🎮 Partidas** (Dropdown)
  - 🏆 Ranking
  - 🎯 Lobby & Matchmaking
  - 📊 Partidas Recentes
  - 🔴 Ao Vivo
- **🎓 Aprendizado** (Dropdown)
  - 👨‍🏫 Coaching
  - 📜 Build Orders
- **💬 Discord** - Servidor oficial
- **ℹ️ Informações** (Dropdown)
  - 💰 Doações
  - 📞 Contato
- **🌐 Mídias Sociais** (Dropdown)
  - 🐦 Twitter
  - 📺 YouTube
  - 🎥 Twitch
  - 📸 Instagram

## 🚀 Como executar

### Pré-requisitos
- Node.js 18+
- Python 3.8+
- pip

### Instalação completa

1. **Instalar dependências do frontend:**
```bash
npm install
```

2. **Instalar dependências do backend:**
```bash
npm run backend:install
```

3. **Executar frontend e backend simultaneamente:**
```bash
npm start
```

### Execução separada

**Apenas frontend:**
```bash
npm run dev
```

**Apenas backend:**
```bash
npm run backend
```

## 🌐 URLs de acesso

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📁 Estrutura do projeto

```
fellowsheep-gaming/
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas da aplicação
│   └── services/          # Serviços (API)
├── backend/               # Backend Python
│   ├── main.py           # Servidor FastAPI
│   ├── requirements.txt  # Dependências Python
│   └── README.md         # Documentação do backend
├── public/               # Arquivos estáticos
└── package.json          # Configuração Node.js
```

## 🔧 Desenvolvimento

### Scripts disponíveis

- `npm start` - Executa frontend e backend
- `npm run dev` - Apenas frontend
- `npm run backend` - Apenas backend
- `npm run build` - Build de produção
- `npm run backend:install` - Instalar dependências Python

### Variáveis de ambiente

O frontend automaticamente detecta se está em desenvolvimento ou produção:
- **Desenvolvimento**: Usa `http://localhost:8000` (backend local)
- **Produção**: Usa `https://fellowsheep-backend.vercel.app` (backend remoto)

## 🚀 Deploy

### Frontend (Vercel)
O frontend é automaticamente deployado no Vercel quando há push para o GitHub.

### Backend (Vercel)
O backend pode ser deployado como uma função serverless no Vercel ou em qualquer servidor Python.

## 📚 Documentação

- [Backend API](./backend/README.md) - Documentação completa da API
- [Frontend](./src/) - Código do frontend React
- [API Docs](http://localhost:8000/docs) - Documentação interativa da API (quando backend estiver rodando)

## 🤝 Contribuindo

Este é um projeto opensource! Contribuições são bem-vindas:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

- **SheepKing** - Líder do Clan
- **WoolWarrior** - Vice-Líder
- **FlockCommander** - Moderador & Desenvolvedor
- **RamMaster** - Organizador de Eventos

## 📞 Contato

- **Discord**: [discord.gg/fellowsheep](https://discord.gg/fellowsheep)
- **Email**: contato@fellowsheep.com
- **Website**: [fellowsheep-gaming.com](https://fellowsheep-gaming.com)

---

*Feito com ❤️ pela comunidade Fellowsheep Gaming* 