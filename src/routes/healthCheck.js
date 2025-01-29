const express = require('express');
const { HealthCheck } = require('../models');
const router = express.Router();

router.use((req, res, next) => {
    if (req.method === 'HEAD') {
      return res.status(405).end();
    }
    next();
  });

router.get('/', async (req, res) => {
  try {
    if (req.body && Object.keys(req.body).length) {
      return res.status(400).end();
    }

    const healthCheck = await HealthCheck.create({});
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.status(200).end();
  } catch (error) {
    res.status(503).end();
  }
});

router.all('*', (req, res) => {
  res.status(405).end();
});

module.exports = router;