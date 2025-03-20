const express = require('express');
const healthCheckRouter = require('./routes/healthCheck');
const fileRoutes = require('./routes/files'); // Import file API routes

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Health check route
app.use('/healthz', healthCheckRouter);

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
