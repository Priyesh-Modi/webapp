const express = require('express');
const healthCheckRouter = require('./routes/healthCheck');

const app = express();
app.use(express.json());

app.use('/healthz', healthCheckRouter);

module.exports = app;