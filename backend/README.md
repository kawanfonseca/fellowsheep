# 🐑 FellowSheep Gaming Backend Proxy

Backend proxy para o site FellowSheep Gaming que serve como intermediário para a API do Age of Empires 2 DE.

## 🚀 Como executar

### Pré-requisitos
- Python 3.8+
- pip

### Instalação

1. **Instalar dependências:**
```bash
pip install -r requirements.txt
```

2. **Executar o servidor:**
```bash
python start.py
```

Ou diretamente:
```bash
python main.py
```

### Variáveis de ambiente

- `HOST`: Host do servidor (padrão: 0.0.0.0)
- `PORT`: Porta do servidor (padrão: 8000)
- `RELOAD`: Habilitar reload automático (padrão: true)

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
Acesse `http://localhost:8000/docs` para ver a documentação interativa da API.

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
      "src": "main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main.py"
    }
  ]
}
```

### Railway
Para deploy no Railway, use o comando:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Render
Para deploy no Render, configure o comando de build:
```bash
pip install -r requirements.txt
```

E o comando de start:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```
