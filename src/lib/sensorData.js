const API_BASE_URL = import.meta.env.VITE_IOT_API_URL || "http://localhost:3001";

const SENSOR_RANGES = {
  temperature: { unit: "°C", min: 16, max: 38, target: 24 },
  humidity: { unit: "%", min: 30, max: 90, target: 58 },
  co2: { unit: "ppm", min: 300, max: 1600, target: 600 },
  luminosity: { unit: "lux", min: 0, max: 1200, target: 650 },
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function classifyReading(reading) {
  const flags = {
    temperature: reading.temperature > 30 || reading.temperature < 18,
    humidity: reading.humidity > 78 || reading.humidity < 40,
    co2: reading.co2 > 900,
    luminosity: reading.luminosity < 220,
  };

  const anomalyCount = Object.values(flags).filter(Boolean).length;

  if (reading.co2 > 1100 || reading.temperature > 33 || anomalyCount >= 3) {
    return "critico";
  }

  if (anomalyCount >= 1) {
    return "alerta";
  }

  return "normal";
}

function generateReading(index, totalPoints) {
  const angle = index / 3.8;
  const drift = totalPoints - index;
  const timestamp = new Date(Date.now() - drift * 5 * 60 * 1000);

  const temperature = clamp(24 + Math.sin(angle) * 3.6 + (index % 11 === 0 ? 4.5 : 0), 16, 37);
  const humidity = clamp(58 + Math.cos(angle / 1.3) * 10 - (index % 10 === 0 ? 8 : 0), 32, 86);
  const co2 = clamp(540 + Math.sin(angle / 1.7) * 150 + (index % 13 === 0 ? 420 : 0), 360, 1500);
  const luminosity = clamp(620 + Math.cos(angle / 1.9) * 220 - (index % 9 === 0 ? 280 : 0), 60, 1100);

  return {
    id: `reading-${index}`,
    timestamp: timestamp.toISOString(),
    time: timestamp.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: Number(temperature.toFixed(1)),
    humidity: Number(humidity.toFixed(1)),
    co2: Math.round(co2),
    luminosity: Math.round(luminosity),
  };
}

function buildAlerts(readings) {
  return readings
    .slice()
    .reverse()
    .filter((reading) => classifyReading(reading) !== "normal")
    .slice(0, 6)
    .map((reading, index) => {
      const severity = classifyReading(reading);

      if (reading.co2 > 900) {
        return {
          id: `alert-co2-${index}`,
          type: severity === "critico" ? "critical" : "warning",
          sensor: "CO2",
          message: "Concentracao acima do limite de conforto.",
          value: `${reading.co2} ppm`,
          time: new Date(reading.timestamp).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: severity === "critico" ? "Ativo" : "Monitorando",
        };
      }

      if (reading.temperature > 30 || reading.temperature < 18) {
        return {
          id: `alert-temp-${index}`,
          type: severity === "critico" ? "critical" : "warning",
          sensor: "Temperatura",
          message: "Faixa termica fora do padrao operacional.",
          value: `${reading.temperature.toFixed(1)} °C`,
          time: new Date(reading.timestamp).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "Ativo",
        };
      }

      return {
        id: `alert-amb-${index}`,
        type: "info",
        sensor: "Ambiente",
        message: "Baixa luminosidade detectada na ultima janela.",
        value: `${reading.luminosity} lux`,
        time: new Date(reading.timestamp).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "Monitorando",
      };
    });
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildDashboardData() {
  const readings = Array.from({ length: 30 }, (_, index) => generateReading(index + 1, 30));
  const latest = readings[readings.length - 1];
  const lastHour = readings.slice(-12);
  const classes = readings.map(classifyReading);
  const anomalies = classes.filter((value) => value !== "normal").length;

  return {
    meta: {
      projectName: "Smart Greenhouse Pipeline",
      scenario: "Monitoramento ambiental com ESP32, MQTT e AWS",
      lastUpdate: latest.timestamp,
      dataSource: "Simulacao local",
      pollingIntervalMs: 10000,
    },
    currentValues: {
      temperature: { ...SENSOR_RANGES.temperature, value: latest.temperature },
      humidity: { ...SENSOR_RANGES.humidity, value: latest.humidity },
      co2: { ...SENSOR_RANGES.co2, value: latest.co2 },
      luminosity: { ...SENSOR_RANGES.luminosity, value: latest.luminosity },
    },
    timeSeriesData: readings,
    barData: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"].map((name, index) => {
      const daySlice = readings.slice(index * 4, index * 4 + 4);
      return {
        name,
        temperature: Number(average(daySlice.map((item) => item.temperature)).toFixed(1)),
        humidity: Number(average(daySlice.map((item) => item.humidity)).toFixed(1)),
        co2: Math.round(average(daySlice.map((item) => item.co2))),
        luminosity: Math.round(average(daySlice.map((item) => item.luminosity))),
      };
    }),
    alerts: buildAlerts(readings),
    services: [
      { name: "Broker MQTT", status: "online", latency: "18ms", detail: "Mosquitto em EC2" },
      { name: "Node-RED", status: "online", latency: "25ms", detail: "Transformacao e roteamento" },
      { name: "InfluxDB", status: "online", latency: "11ms", detail: "Series temporais" },
      { name: "API Node.js", status: "online", latency: "31ms", detail: "Regras de negocio" },
      { name: "MySQL", status: "online", latency: "20ms", detail: "Dados consolidados" },
      { name: "Grafana", status: "online", latency: "16ms", detail: "Observabilidade" },
    ],
    processedMetrics: [
      {
        label: "Media hora (temp.)",
        value: `${average(lastHour.map((item) => item.temperature)).toFixed(1)} °C`,
        description: "Regra de agregacao para reduzir granularidade.",
      },
      {
        label: "Classificacao atual",
        value: classifyReading(latest).toUpperCase(),
        description: "Leitura classificada em normal, alerta ou critico.",
      },
      {
        label: "Anomalias 24h",
        value: `${anomalies}`,
        description: "Eventos fora da faixa padrao identificados pelo backend.",
      },
      {
        label: "Consolidacao",
        value: "5 min",
        description: "Sensores agrupados por janela para consulta rapida.",
      },
    ],
    pipelineSteps: [
      "ESP32 no Wokwi publica JSON no topico greenhouse/sensors",
      "Broker MQTT recebe e encaminha para o Node-RED",
      "Node-RED valida payload, grava no InfluxDB e chama a API",
      "Backend Node.js aplica regras e consolida no MySQL",
      "Frontend React e Grafana exibem dados em tempo real",
    ],
  };
}

export function getFallbackDashboardData() {
  return buildDashboardData();
}

export async function fetchDashboardData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`);

    if (!response.ok) {
      throw new Error(`API respondeu ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return buildDashboardData();
  }
}
