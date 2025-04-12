// const express = require('express');
// const { HealthCheck } = require('../models');
// const StatsD = require('hot-shots');
// const router = express.Router();
// const client = new StatsD();

// router.use((req, res, next) => {
//     if (req.method === 'HEAD') {
//         return res.status(405).end();
//     }
//     next();
// });

// router.get('/', async (req, res) => {
//     const startDb = Date.now();

//     try {
//         if (Object.keys(req.query).length > 0) {
//             console.error("Request contains query parameters");
//             return res.status(400).end();
//         }

//         if (req.headers['content-length'] && parseInt(req.headers['content-length'], 10) > 0) {
//             return res.status(400).end();
//         }

//         await HealthCheck.create({});

//         const dbDuration = Date.now() - startDb;
//         client.timing("db.query_time", dbDuration);

//         res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
//         res.set('Pragma', 'no-cache');
//         return res.status(200).end();
//     } catch (error) {
//         const dbDuration = Date.now() - startDb;
//         client.timing("db.query_time", dbDuration);
//         return res.status(503).end();
//     }
// });

// router.all('*', (req, res) => {
//     return res.status(405).end();
// });

// module.exports = router;
