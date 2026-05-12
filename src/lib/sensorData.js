const API_BASE_URL = import.meta.env.VITE_IOT_API_URL || window.location.origin;

const SENSOR_RANGES = {
  temperature: { unit: "°C", min: 16, max: 38, target: 24, value: 0 },
  humidity: { unit: "%", min: 30, max: 90, target: 58, value: 0 },
  co2: { unit: "ppm", min: 300, max: 1600, target: 600, value: 0 },
  luminosity: { unit: "lux", min: 0, max: 1200, target: 650, value: 0 },
};

export function getEmptyDashboardData() {
  return {
    meta: {
      projectName: "Smart Greenhouse Pipeline",
      scenario: "Monitoramento ambiental com ESP32, MQTT e AWS",
      lastUpdate: null,
      dataSource: "Sem dados",
      pollingIntervalMs: 10000,
    },
    currentValues: {
      temperature: { ...SENSOR_RANGES.temperature },
      humidity: { ...SENSOR_RANGES.humidity },
      co2: { ...SENSOR_RANGES.co2 },
      luminosity: { ...SENSOR_RANGES.luminosity },
    },
    timeSeriesData: [],
    barData: [],
    alerts: [],
    processedMetrics: [
      {
        label: "Media hora (temp.)",
        value: "--",
        description: "Aguardando leituras reais para calcular a media.",
      },
      {
        label: "Classificacao atual",
        value: "--",
        description: "A classificacao sera exibida quando houver dados.",
      },
      {
        label: "Anomalias 24h",
        value: "--",
        description: "Sem leituras para contabilizar anomalias ainda.",
      },
      {
        label: "Consolidacao",
        value: "5 min",
        description: "Janela configurada para agregacao das leituras.",
      },
    ],
    summary: {},
    services: [
      { name: "Broker MQTT", status: "online", latency: "--", detail: "Mosquitto em EC2" },
      { name: "Node-RED", status: "online", latency: "--", detail: "Transformacao e roteamento" },
      { name: "InfluxDB", status: "online", latency: "--", detail: "Series temporais" },
      { name: "API Node.js", status: "online", latency: "--", detail: "Regras de negocio" },
      { name: "MySQL", status: "online", latency: "--", detail: "Dados consolidados" },
      { name: "Grafana", status: "online", latency: "--", detail: "Observabilidade" },
    ],
    pipelineSteps: [
      "Colab ou ESP32 publica JSON no topico sensor/lab01/telemetria",
      "Broker MQTT recebe e encaminha para o Node-RED",
      "Node-RED valida payload, grava no InfluxDB e chama a API",
      "Backend Node.js aplica regras e consolida no MySQL",
      "Frontend React e Grafana exibem dados em tempo real",
    ],
  };
}

export async function fetchDashboardData() {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`);

  if (!response.ok) {
    throw new Error(`API respondeu ${response.status}`);
  }

  return await response.json();
}
