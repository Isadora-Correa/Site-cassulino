# Node-RED

O fluxo exportado em `flows.json` representa o pipeline minimo da etapa MING:

1. `mqtt in` recebe o JSON do ESP32.
2. `json` converte o payload.
3. `function` adiciona classificacao simples.
4. `debug` permite validacao local.
5. `http request` envia os dados tratados para a API Node.js.
6. `influxdb out` persiste as series temporais.

Adapte as credenciais do broker MQTT, InfluxDB e da API conforme o seu ambiente.
