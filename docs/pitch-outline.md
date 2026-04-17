# Roteiro de Pitch

## 1. Problema

Falta de visibilidade em tempo real sobre condicoes ambientais de uma estufa inteligente.

## 2. Solucao

Pipeline IoT na AWS com coleta via ESP32, processamento em Node-RED e camada web para inteligencia dos dados.

## 3. Destaques tecnicos

- MQTT para comunicacao leve.
- Node-RED para orquestracao do pipeline.
- InfluxDB + Grafana para observabilidade.
- Node.js + MySQL para regras de negocio.
- React para visualizacao dos dados processados.

## 4. Demonstracao

1. Simulacao do ESP32 no Wokwi.
2. Mensagem chegando no MQTT.
3. Fluxo no Node-RED.
4. Dashboard Grafana.
5. Dashboard React consumindo a API.
