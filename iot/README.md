# IoT / ESP32

Esta pasta contem a simulacao do dispositivo no Wokwi.

## Cenario

- Dispositivo: ESP32
- Sensores simulados: temperatura, umidade, CO2 e luminosidade
- Protocolo: MQTT
- Payload: JSON
- Topico sugerido: `greenhouse/sensors`

## Como usar

1. Abra o projeto no Wokwi.
2. Ajuste SSID, senha e host MQTT no arquivo `wokwi/sketch.ino`.
3. Execute a simulacao.
4. Verifique a chegada dos dados no broker MQTT e no Node-RED.
