import { createServer } from "node:http";
import { fetchInfluxTelemetryReadings } from "./src/services/influxTelemetry.js";
import { buildDashboardPayload, buildHealthPayload } from "./src/services/analytics.js";

const PORT = Number(process.env.PORT || 3001);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  response.end(JSON.stringify(payload, null, 2));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    request.on("error", reject);
  });
}

const server = createServer(async (request, response) => {
  if (!request.url) {
    sendJson(response, 400, { error: "invalid_request" });
    return;
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    response.end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);
  let readings = [];

  try {
    readings = await fetchInfluxTelemetryReadings();
  } catch (error) {
    readings = [];
  }

  const dashboard = buildDashboardPayload({ readings });

  if (url.pathname === "/health") {
    sendJson(response, 200, buildHealthPayload(dashboard.services));
    return;
  }

  if (url.pathname === "/api/dashboard") {
    sendJson(response, 200, dashboard);
    return;
  }

  if (url.pathname === "/api/ingest" && request.method === "POST") {
    sendJson(response, 410, {
      error: "deprecated_endpoint",
      message: "A ingestao em memoria foi removida. Use o InfluxDB como fonte oficial dos dados.",
    });
    return;
  }

  if (url.pathname === "/api/telemetry/latest") {
    sendJson(response, 200, {
      meta: dashboard.meta,
      currentValues: dashboard.currentValues,
    });
    return;
  }

  if (url.pathname === "/api/telemetry/readings") {
    sendJson(response, 200, {
      items: dashboard.timeSeriesData,
      total: dashboard.timeSeriesData.length,
    });
    return;
  }

  if (url.pathname === "/api/telemetry/processed") {
    sendJson(response, 200, {
      processedMetrics: dashboard.processedMetrics,
      summary: dashboard.summary,
    });
    return;
  }

  if (url.pathname === "/api/alerts") {
    sendJson(response, 200, {
      items: dashboard.alerts,
      total: dashboard.alerts.length,
    });
    return;
  }

  sendJson(response, 404, { error: "not_found", path: url.pathname });
});

server.listen(PORT, () => {
  console.log(`IoT API running at http://localhost:${PORT}`);
});
