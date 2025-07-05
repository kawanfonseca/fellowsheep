# 🐑 FellowSheep Gaming Backend Proxy

Backend proxy para o site FellowSheep Gaming que serve como intermediário para a API do Age of Empires 2 DE.

## 🚀 Como executar

### Pré-requisitos
- Node.js 18+
- npm

### Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar o servidor:**
```bash
npm start
```

Para desenvolvimento com reload automático:
```bash
npm run dev
```

### Variáveis de ambiente

- `PORT`: Porta do servidor (padrão: 8000)
- `NODE_ENV`: Ambiente (development/production)

## 📚 Endpoints da API

### Health Check
- `GET /health` - Verificar status do servidor

### Leaderboards
- `GET /api/leaderboards` - Listar leaderboards disponíveis
- `GET /api/leaderboard/{leaderboard_id}` - Buscar ranking específico

### Jogadores
- `GET /api/player/stats?profile_ids=1,2,3` - Estatísticas de jogadores
- `GET /api/search/player?name=TheViper` - Buscar jogador por nome

## 🔧 Desenvolvimento

### Documentação da API
Acesse `http://localhost:8000/` para ver informações sobre os endpoints disponíveis.

### Logs
O servidor registra logs detalhados de todas as requisições e erros.

## 🌐 CORS
O backend está configurado para aceitar requisições dos seguintes domínios:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)
- `https://fellowsheep.vercel.app` (Produção)
- `https://fellowsheep-gaming.vercel.app` (Alternativa)

## 🚀 Deploy

### Vercel
Para deploy no Vercel, crie um arquivo `vercel.json` na raiz do projeto:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Railway
Para deploy no Railway, use o comando:
```bash
npm start
```

### Render
Para deploy no Render, configure o comando de build:
```bash
npm install
```

E o comando de start:
```bash
npm start
```
