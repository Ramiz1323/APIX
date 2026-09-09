const router = require('express').Router();
const { getStats } = require('./stats.controller.js');

// Statistics route for dashboards and analytics
router.get('/', getStats);

module.exports = router;
