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
        // Check for query parameters
        if (Object.keys(req.query).length > 0) {
            console.error("Request contains query parameters");
            return res.status(400).end();
        }

        // Check for content-length in headers
        if (req.headers['content-length'] && parseInt(req.headers['content-length'], 10) > 0) {
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

// Catch-all for unsupported methods
router.all('*', (req, res) => {
    res.status(405).end();
});

module.exports = router;
