# Backend Node.js

API REST minima para a etapa web do projeto.

## Endpoints

- `GET /health`
- `GET /api/dashboard`
- `GET /api/telemetry/latest`
- `GET /api/telemetry/readings`
- `GET /api/telemetry/processed`
- `GET /api/alerts`

## Executar

```bash
cd backend
npm start
```

Por padrao a API sobe em `http://localhost:3001`.

## Observacao

O servidor usa dados simulados para facilitar a demonstracao local. O schema MySQL esta em `sql/schema.sql` para a versao persistente do projeto.
