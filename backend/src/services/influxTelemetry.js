import { InfluxDB } from "@influxdata/influxdb-client";

const DEFAULT_FIELDS = ["temperatura", "umidade", "luminosidade", "co2"];
const DEFAULT_RANGE = "-6h";
const DEFAULT_LIMIT = 30;

function getInfluxConfig() {
  return {
    url: process.env.INFLUX_URL || "http://localhost:8086",
    token: process.env.INFLUX_TOKEN || "",
    org: process.env.INFLUX_ORG || "",
    bucket: process.env.INFLUX_BUCKET || "",
    measurement: process.env.INFLUX_MEASUREMENT || "sensordata",
  };
}

function isConfigured(config) {
  return Boolean(config.url && config.token && config.org && config.bucket && config.measurement);
}

function buildFluxQuery({ bucket, measurement }, limit = DEFAULT_LIMIT) {
  const fieldFilters = DEFAULT_FIELDS.map((field) => `r._field == "${field}"`).join(" or ");

  return `
from(bucket: "${bucket}")
  |> range(start: ${DEFAULT_RANGE})
  |> filter(fn: (r) => r._measurement == "${measurement}")
  |> filter(fn: (r) => ${fieldFilters})
  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> sort(columns: ["_time"], desc: false)
  |> tail(n: ${limit})
`;
}

function normalizeReading(row, index) {
  const timestamp = new Date(row._time).toISOString();

  return {
    id: `influx-${index + 1}`,
    timestamp,
    time: new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: Number(Number(row.temperatura ?? row.temperature ?? 0).toFixed(1)),
    humidity: Number(Number(row.umidade ?? row.humidity ?? 0).toFixed(1)),
    co2: Math.round(Number(row.co2 ?? 0)),
    luminosity: Math.round(Number(row.luminosidade ?? row.luminosity ?? 0)),
  };
}

export async function fetchInfluxTelemetryReadings(limit = DEFAULT_LIMIT) {
  const config = getInfluxConfig();

  if (!isConfigured(config)) {
    return [];
  }

  const queryApi = new InfluxDB({
    url: config.url,
    token: config.token,
  }).getQueryApi(config.org);

  const fluxQuery = buildFluxQuery(config, limit);
  const readings = [];

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const row = tableMeta.toObject(values);

    if (
      row._time &&
      row.co2 !== undefined &&
      (row.temperatura !== undefined || row.temperature !== undefined) &&
      (row.umidade !== undefined || row.humidity !== undefined) &&
      (row.luminosidade !== undefined || row.luminosity !== undefined)
    ) {
      readings.push(row);
    }
  }

  return readings.map(normalizeReading);
}
