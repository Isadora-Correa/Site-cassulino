const MAX_READINGS = 30;

const telemetryReadings = [];

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeTimestamp(value) {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export function normalizeIncomingReading(payload = {}) {
  const temperature = toNumber(payload.temperature ?? payload.temperatura);
  const humidity = toNumber(payload.humidity ?? payload.umidade);
  const luminosity = toNumber(payload.luminosity ?? payload.luminosidade);
  const co2 = toNumber(payload.co2 ?? payload.CO2);

  if ([temperature, humidity, luminosity, co2].some((value) => value === null)) {
    return null;
  }

  const timestamp = normalizeTimestamp(payload.timestamp);

  return {
    id: `reading-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp,
    time: new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: Number(temperature.toFixed(1)),
    humidity: Number(humidity.toFixed(1)),
    co2: Math.round(co2),
    luminosity: Math.round(luminosity),
  };
}

export function addIncomingReading(payload = {}) {
  const reading = normalizeIncomingReading(payload);

  if (!reading) {
    return null;
  }

  telemetryReadings.push(reading);

  if (telemetryReadings.length > MAX_READINGS) {
    telemetryReadings.splice(0, telemetryReadings.length - MAX_READINGS);
  }

  return reading;
}

export function getTelemetryReadings() {
  return telemetryReadings.slice();
}
