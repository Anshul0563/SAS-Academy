const DEFAULT_CLIENT_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3002",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "https://lexora-zeta-seven.vercel.app",
];

const parseOrigins = (value = "") =>
  value
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

// CLIENT_URLS extends the safe defaults so a stale deployment variable cannot
// accidentally remove the production Vercel origin or local development.
const getAllowedOrigins = (clientUrls = process.env.CLIENT_URLS) =>
  [...new Set([...DEFAULT_CLIENT_ORIGINS, ...parseOrigins(clientUrls)])];

const createCorsOptions = (clientUrls) => {
  const allowedOrigins = getAllowedOrigins(clientUrls);

  return {
    origin(origin, callback) {
      // Requests without Origin (health checks, curl, server-to-server) are not CORS requests.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: false,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
    optionsSuccessStatus: 204,
  };
};

module.exports = { createCorsOptions, getAllowedOrigins };
