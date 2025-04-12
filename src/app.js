const express = require('express');
const healthCheckRouter = require('./routes/healthCheck');
// const cicdRoute = require('./routes/cicdRouteEndpoint'); 
const fileRoutes = require('./routes/files'); 

const app = express();

const winston = require('winston');
const StatsD = require('hot-shots');
const client = new StatsD();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: '/var/log/webapp.log' }),
  ],
});

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
      client.increment(`api.${req.method}.${req.path.replace(/\//g, "_")}.count`);
      client.timing(`api.${req.method}.${req.path.replace(/\//g, "_")}.time`, duration);
    });
    next();
  });
  
// Middleware for parsing JSON
app.use(express.json());

// Health check route
app.use('/healthz', healthCheckRouter);

// app.use('/cicd', cicdRoute);

// File API routes
app.use('/v1', fileRoutes);

// Error handling middleware for invalid JSON payloads
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ error: "Invalid JSON format" });
    }
    next(err);
});

// 404 Not Found Middleware
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

module.exports = app;
