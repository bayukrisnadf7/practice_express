const client = require("prom-client");

// Default Node.js system metrics (CPU, Memory, Event Loop, GC)
client.collectDefaultMetrics({
  prefix: "express_app_",
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const httpErrorsTotal = new client.Counter({
  name: "http_errors_total",
  help: "Total number of HTTP errors (4xx and 5xx)",
  labelNames: ["method", "route", "status_code"],
});

const activeRequestsGauge = new client.Gauge({
  name: "http_active_requests",
  help: "Number of currently active HTTP requests",
});

module.exports = {
  client,
  httpRequestDuration,
  httpRequestsTotal,
  httpErrorsTotal,
  activeRequestsGauge,
};