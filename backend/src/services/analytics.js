const SENSOR_RANGES = {
  temperature: { unit: "°C", min: 16, max: 38, target: 24 },
  humidity: { unit: "%", min: 30, max: 90, target: 58 },
  co2: { unit: "ppm", min: 300, max: 1600, target: 600 },
  luminosity: { unit: "lux", min: 0, max: 1200, target: 650 },
};

function average(values) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function classifyReading(reading) {
  const anomalyCount = [
    reading.temperature > 30 || reading.temperature < 18,
    reading.humidity > 78 || reading.humidity < 40,
    reading.co2 > 900,
    reading.luminosity < 220,
  ].filter(Boolean).length;

  if (reading.co2 > 1100 || reading.temperature > 33 || anomalyCount >= 3) {
    return "critico";
  }

  if (anomalyCount >= 1) {
    return "alerta";
  }

  return "normal";
}

function buildAlerts(readings) {
  return readings
    .slice()
    .reverse()
    .filter((reading) => classifyReading(reading) !== "normal")
    .slice(0, 6)
    .map((reading, index) => {
      if (reading.co2 > 900) {
        return {
          id: `co2-${index}`,
          type: reading.co2 > 1100 ? "critical" : "warning",
          sensor: "CO2",
          message: "Concentracao acima do limite recomendado.",
          value: `${reading.co2} ppm`,
          time: new Date(reading.timestamp).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "Ativo",
        };
      }

      if (reading.temperature > 30 || reading.temperature < 18) {
        return {
          id: `temperature-${index}`,
          type: reading.temperature > 33 ? "critical" : "warning",
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
        id: `light-${index}`,
        type: "info",
        sensor: "Luminosidade",
        message: "Luminosidade abaixo do valor alvo.",
        value: `${reading.luminosity} lux`,
        time: new Date(reading.timestamp).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "Monitorando",
      };
    });
}

function buildBarData(readings) {
  const labels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
  const chunkSize = Math.max(1, Math.ceil(readings.length / labels.length));

  return labels.map((name, index) => {
    const start = index * chunkSize;
    const sourceSlice = readings.slice(start, start + chunkSize);
    const fallbackSlice = sourceSlice.length ? sourceSlice : [readings[readings.length - 1]];

    return {
      name,
      temperature: Number(average(fallbackSlice.map((item) => item.temperature)).toFixed(1)),
      humidity: Number(average(fallbackSlice.map((item) => item.humidity)).toFixed(1)),
      co2: Math.round(average(fallbackSlice.map((item) => item.co2))),
      luminosity: Math.round(average(fallbackSlice.map((item) => item.luminosity))),
    };
  });
}

export function buildDashboardPayload(options = {}) {
  const hasRealtimeReadings = Array.isArray(options.readings) && options.readings.length > 0;
  const readings = hasRealtimeReadings ? options.readings : [];

  if (!readings.length) {
    return {
      meta: {
        projectName: "Smart Greenhouse Pipeline",
        scenario: "Monitoramento ambiental com ESP32, MQTT, AWS e camada web",
        lastUpdate: null,
        dataSource: "Sem dados",
        pollingIntervalMs: 10000,
      },
      currentValues: {
        temperature: { ...SENSOR_RANGES.temperature, value: 0 },
        humidity: { ...SENSOR_RANGES.humidity, value: 0 },
        co2: { ...SENSOR_RANGES.co2, value: 0 },
        luminosity: { ...SENSOR_RANGES.luminosity, value: 0 },
      },
      timeSeriesData: [],
      barData: [],
      alerts: [],
      services: [
        { name: "Broker MQTT", status: "online", latency: "18ms", detail: "Mosquitto em EC2" },
        { name: "Node-RED", status: "online", latency: "25ms", detail: "Orquestracao do pipeline" },
        { name: "InfluxDB", status: "online", latency: "11ms", detail: "Series temporais" },
        { name: "API Node.js", status: "online", latency: "31ms", detail: "REST e regras de negocio" },
        { name: "MySQL", status: "online", latency: "20ms", detail: "Consolidacao relacional" },
        { name: "Grafana", status: "online", latency: "16ms", detail: "Dashboard operacional" },
      ],
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
          description: "Dados resumidos antes de persistir no banco relacional.",
        },
      ],
      summary: {},
      pipelineSteps: [
        "Colab ou ESP32 publica JSON no topico sensor/lab01/telemetria",
        "Broker MQTT recebe e encaminha para o Node-RED",
        "Node-RED valida payload, grava no InfluxDB e chama a API",
        "Backend Node.js aplica regras e consolida no MySQL",
        "Frontend React e Grafana exibem dados em tempo real",
      ],
    };
  }

  const latest = readings[readings.length - 1];
  const lastHour = readings.slice(-12);
  const classifications = readings.map(classifyReading);
  const anomalies = classifications.filter((item) => item !== "normal").length;
  const criticalCount = classifications.filter((item) => item === "critico").length;

  return {
    meta: {
      projectName: "Smart Greenhouse Pipeline",
      scenario: "Monitoramento ambiental com ESP32, MQTT, AWS e camada web",
      lastUpdate: latest.timestamp,
      dataSource: hasRealtimeReadings ? "InfluxDB" : "Sem dados",
      pollingIntervalMs: 10000,
    },
    currentValues: {
      temperature: { ...SENSOR_RANGES.temperature, value: latest.temperature },
      humidity: { ...SENSOR_RANGES.humidity, value: latest.humidity },
      co2: { ...SENSOR_RANGES.co2, value: latest.co2 },
      luminosity: { ...SENSOR_RANGES.luminosity, value: latest.luminosity },
    },
    timeSeriesData: readings,
    barData: buildBarData(readings),
    alerts: buildAlerts(readings),
    services: [
      { name: "Broker MQTT", status: "online", latency: "18ms", detail: "Mosquitto em EC2" },
      { name: "Node-RED", status: "online", latency: "25ms", detail: "Orquestracao do pipeline" },
      { name: "InfluxDB", status: "online", latency: "11ms", detail: "Series temporais" },
      { name: "API Node.js", status: "online", latency: "31ms", detail: "REST e regras de negocio" },
      { name: "MySQL", status: "online", latency: "20ms", detail: "Consolidacao relacional" },
      { name: "Grafana", status: "online", latency: "16ms", detail: "Dashboard operacional" },
    ],
    processedMetrics: [
      {
        label: "Media hora (temp.)",
        value: `${average(lastHour.map((item) => item.temperature)).toFixed(1)} °C`,
        description: "Agregacao por janela para apoiar analise e reduzir granularidade.",
      },
      {
        label: "Classificacao atual",
        value: classifyReading(latest).toUpperCase(),
        description: "Motor de classificacao simples com estados normal, alerta e critico.",
      },
      {
        label: "Anomalias 24h",
        value: `${anomalies}`,
        description: "Leituras fora da faixa configurada identificadas automaticamente.",
      },
      {
        label: "Consolidacao",
        value: "5 min",
        description: "Dados resumidos antes de persistir no banco relacional.",
      },
    ],
    summary: {
      averageTemperatureHour: Number(average(lastHour.map((item) => item.temperature)).toFixed(1)),
      averageHumidityHour: Number(average(lastHour.map((item) => item.humidity)).toFixed(1)),
      averageCo2Hour: Math.round(average(lastHour.map((item) => item.co2))),
      anomalyCount: anomalies,
      criticalCount,
      latestClassification: classifyReading(latest),
    },
    pipelineSteps: [
      "Colab ou ESP32 publica JSON no topico sensor/lab01/telemetria",
      "Broker MQTT recebe e encaminha para o Node-RED",
      "Node-RED valida payload, grava no InfluxDB e chama a API",
      "Backend Node.js aplica regras e consolida no MySQL",
      "Frontend React e Grafana exibem dados em tempo real",
    ],
  };
}

export function buildHealthPayload(services) {
  return {
    status: services.every((service) => service.status === "online") ? "ok" : "degraded",
    checkedAt: new Date().toISOString(),
    services,
  };
}
