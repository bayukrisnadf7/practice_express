const {
  httpRequestDuration,
  httpRequestsTotal,
  httpErrorsTotal,
  activeRequestsGauge,
} = require("../utils/metrics/metrics");

/**
 * Normalize route to prevent high-cardinality explosion in Prometheus
 * e.g., `/api/users/cm83h4...` becomes `/api/users/:id`
 */
function getNormalizedRoute(req) {
  if (req.route && req.route.path) {
    return `${req.baseUrl || ""}${req.route.path}`;
  }
  // Fallback for unmatched routes or static paths to avoid cardinality issues
  return req.path
    ? req.path.replace(/[0-9a-fA-F-]{8,}/g, ":id").replace(/\/\d+/g, "/:id")
    : "unknown";
}

const metricsMiddleware = (req, res, next) => {
  // Skip metrics scraping endpoint to avoid polluting metrics data
  if (req.path === "/metrics") {
    return next();
  }

  activeRequestsGauge.inc();
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    activeRequestsGauge.dec();

    const duration = Number(process.hrtime.bigint() - start) / 1e9;
    const route = getNormalizedRoute(req);

    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode,
    };

    httpRequestDuration.observe(labels, duration);
    httpRequestsTotal.inc(labels);

    if (res.statusCode >= 400) {
      httpErrorsTotal.inc(labels);
    }
  });

  next();
};

module.exports = metricsMiddleware;