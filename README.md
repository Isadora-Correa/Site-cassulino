# IoT Data Pipeline na AWS

Projeto academico de monitoramento ambiental com pipeline IoT completo, do dispositivo simulado ate a visualizacao e camada de negocio.

## Tema

Estufa inteligente com leitura de:

- temperaturaa
- umidade
- CO2
- luminosidade

## Stack

### Etapa 01 - MING

- MQTT
- Node-RED
- InfluxDB
- Grafana

### Etapa 02 - Web

- Backend Node.js
- Frontend React + Vite
- MySQL
- AWS EC2

## Estrutura do repositorio

```text
.
├── backend/      # API REST e schema MySQL
├── docs/         # arquitetura, deploy e roteiro de pitch
├── frontend/     # observacao sobre a estrutura pedida no trabalho
├── iot/          # ESP32 + Wokwi
├── nodered/      # fluxo exportado
└── src/          # frontend React principal
```

## Regras de negocio implementadas

1. Media por periodo da ultima hora.
2. Deteccao de anomalias.
3. Classificacao simples em `normal`, `alerta` e `critico`.
4. Consolidacao em janelas de 5 minutos.

## Como executar

### Frontend

```bash
npm install
npm run dev
```

Opcionalmente configure `VITE_IOT_API_URL` para apontar para o backend:

```bash
VITE_IOT_API_URL=http://localhost:3001
```

### Backend

```bash
cd backend
npm start
```

## Endpoints principais

- `GET /health`
- `GET /api/dashboard`
- `GET /api/telemetry/latest`
- `GET /api/telemetry/readings`
- `GET /api/telemetry/processed`
- `GET /api/alerts`
- `POST /api/ingest`

## Entregaveis incluidos

- Dashboard React para dados processados
- API Node.js com regra de negocio
- Schema MySQL
- Exemplo de firmware ESP32 para Wokwi
- Export de fluxo Node-RED
- Documentacao de arquitetura e deploy AWS

## Documentacao complementar

- [Arquitetura](docs/architecture.md)
- [Deploy AWS](docs/aws-deploy.md)
- [Pitch](docs/pitch-outline.md)
- [Backend](backend/README.md)
- [IoT](iot/README.md)
- [Node-RED](nodered/README.md)
