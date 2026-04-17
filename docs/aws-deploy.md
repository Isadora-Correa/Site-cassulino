# Deploy Basico na AWS

## Sugestao de infraestrutura

- `EC2 Ubuntu`
- `Mosquitto` para MQTT
- `Node-RED`
- `InfluxDB`
- `Grafana`
- `Backend Node.js`
- `MySQL` ou `RDS MySQL`

## Estrategia simples

1. Criar uma EC2 pequena.
2. Liberar portas necessarias no Security Group.
3. Subir backend, Node-RED e broker MQTT na mesma instancia.
4. Publicar frontend com Vite build em Nginx ou em S3/CloudFront.
5. Configurar variavel `VITE_IOT_API_URL` apontando para a API.

## Opcional com Docker Compose

- Um container para `mosquitto`
- Um para `nodered`
- Um para `influxdb`
- Um para `grafana`
- Um para `backend`
